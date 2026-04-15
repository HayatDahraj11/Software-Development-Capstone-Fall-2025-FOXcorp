/**
 * tools.js
 *
 * Defines the tools Clara can call to answer factual questions about a
 * parent's child(ren). Each tool has two parts:
 *
 *   1. A JSON Schema definition passed to OpenAI's function calling API,
 *      this teaches the model what tools exist, what they do, and what
 *      arguments they take.
 *
 *   2. An executor function that the Lambda invokes when the model asks
 *      for that tool. The executor enforces authorization: every tool
 *      validates that the requested student belongs to the current parent.
 *      This prevents the model from being tricked into leaking data.
 *
 * Why tool use instead of RAG?
 *   The parent's questions are structured ("how many days was Tommy
 *   absent this month?") and the answer lives in DynamoDB tables, not
 *   unstructured documents. Tool use is the correct pattern: Clara
 *   translates natural language into typed queries.
 */

const { gql } = require("./graphqlClient");

// GraphQL operations. Kept inline (not imported from src/graphql/queries.ts)
// so the Lambda is self-contained and does not depend on the frontend codegen.

const ATTENDANCES_BY_STUDENT = /* GraphQL */ `
  query AttendancesByStudent($studentId: ID!, $limit: Int) {
    attendancesByStudentId(studentId: $studentId, limit: $limit) {
      items {
        id
        date
        status
        classId
      }
    }
  }
`;

const TEACHER_NOTES_BY_STUDENT = /* GraphQL */ `
  query TeacherNotesByStudent($studentId: ID!, $limit: Int) {
    teacherNotesByStudentId(
      studentId: $studentId
      sortDirection: DESC
      limit: $limit
    ) {
      items {
        id
        title
        body
        category
        createdAt
        teacherId
      }
    }
  }
`;

const INCIDENTS_BY_STUDENT = /* GraphQL */ `
  query IncidentsByStudent($studentId: ID!, $limit: Int) {
    incidentsByStudentId(studentId: $studentId, limit: $limit) {
      items {
        id
        description
        severity
        date
        classId
      }
    }
  }
`;

const ENROLLMENTS_BY_STUDENT = /* GraphQL */ `
  query EnrollmentsByStudent($studentId: ID!) {
    enrollmentsByStudentId(studentId: $studentId) {
      items {
        id
        currentGrade
        classId
        class {
          id
          name
          teacher {
            name
          }
        }
      }
    }
  }
`;

const SCHEDULES_BY_CLASS = /* GraphQL */ `
  query SchedulesByClass($classId: ID!) {
    schedulesByClassId(classId: $classId) {
      items {
        id
        dayOfWeek
        startTime
        endTime
      }
    }
  }
`;

// Authorization helper. Every tool passes through this so the model cannot
// query a student that isn't the current parent's child.

function assertStudentBelongsToParent(studentId, context) {
  const allowedIds = new Set(context.students.map((s) => s.id));
  if (!allowedIds.has(studentId)) {
    return {
      error: `Access denied: student ${studentId} is not one of your children. You can ask about: ${context.students
        .map((s) => `${s.firstName} (${s.id})`)
        .join(", ")}.`,
    };
  }
  return null;
}

// Tool definitions (OpenAI function-calling schema).

const TOOL_DEFINITIONS = [
  {
    type: "function",
    function: {
      name: "get_student_attendance",
      description:
        "Fetches attendance records for a student. Returns per-day status (PRESENT, ABSENT, LATE). Use this when the parent asks about attendance, absences, tardiness, or how often their child is in class.",
      parameters: {
        type: "object",
        properties: {
          studentId: {
            type: "string",
            description: "The ID of the student to query.",
          },
          daysBack: {
            type: "integer",
            description:
              "How many days back to look (e.g. 7 for this week, 30 for this month). Default 30.",
            minimum: 1,
            maximum: 180,
          },
        },
        required: ["studentId"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "get_teacher_notes",
      description:
        "Fetches teacher notes (observations, comments, praise, concerns) written about a student. Use this when the parent asks what teachers have been saying, how their child is doing socially or academically, or for recent updates from school.",
      parameters: {
        type: "object",
        properties: {
          studentId: {
            type: "string",
            description: "The ID of the student to query.",
          },
          limit: {
            type: "integer",
            description: "How many most-recent notes to fetch. Default 10.",
            minimum: 1,
            maximum: 50,
          },
        },
        required: ["studentId"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "get_student_incidents",
      description:
        "Fetches incident records for a student (disciplinary, behavioral, or academic concerns logged by teachers). Use this when the parent asks about behavior, trouble at school, or specific events.",
      parameters: {
        type: "object",
        properties: {
          studentId: {
            type: "string",
            description: "The ID of the student to query.",
          },
          limit: {
            type: "integer",
            description: "How many incidents to fetch. Default 20.",
            minimum: 1,
            maximum: 100,
          },
        },
        required: ["studentId"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "get_student_enrollments",
      description:
        "Fetches all classes a student is enrolled in, including current grade and teacher. Use this when the parent asks about grades, what classes their child has, or who a specific teacher is.",
      parameters: {
        type: "object",
        properties: {
          studentId: {
            type: "string",
            description: "The ID of the student to query.",
          },
        },
        required: ["studentId"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "get_class_schedule",
      description:
        "Fetches the weekly meeting schedule for a specific class (which days, what times). Use this when the parent asks when a class meets, what time school starts, or about upcoming classes.",
      parameters: {
        type: "object",
        properties: {
          classId: {
            type: "string",
            description:
              "The ID of the class. Call get_student_enrollments first if you don't know the class ID.",
          },
        },
        required: ["classId"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "summarize_week",
      description:
        "Generates a rich one-shot summary of a student's last 7 days: attendance pattern, new teacher notes, and any incidents. Use this when the parent asks 'how was this week' or 'give me an update on Tommy'. Much faster than calling the other tools separately.",
      parameters: {
        type: "object",
        properties: {
          studentId: {
            type: "string",
            description: "The ID of the student to summarize.",
          },
        },
        required: ["studentId"],
      },
    },
  },
];

// Tool executors.

async function execute_get_student_attendance(args, context) {
  const guard = assertStudentBelongsToParent(args.studentId, context);
  if (guard) return guard;

  const daysBack = args.daysBack ?? 30;
  const data = await gql(ATTENDANCES_BY_STUDENT, {
    studentId: args.studentId,
    limit: 500,
  });
  const all = data?.attendancesByStudentId?.items ?? [];

  // Filter to the requested window
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - daysBack);
  const cutoffISO = cutoff.toISOString().split("T")[0];
  const recent = all.filter((a) => a.date >= cutoffISO);

  const counts = recent.reduce(
    (acc, a) => {
      acc[a.status] = (acc[a.status] || 0) + 1;
      acc.total += 1;
      return acc;
    },
    { PRESENT: 0, ABSENT: 0, LATE: 0, total: 0 }
  );

  return {
    studentId: args.studentId,
    windowDays: daysBack,
    counts,
    records: recent.slice(0, 30).map((a) => ({
      date: a.date,
      status: a.status,
    })),
  };
}

async function execute_get_teacher_notes(args, context) {
  const guard = assertStudentBelongsToParent(args.studentId, context);
  if (guard) return guard;

  const data = await gql(TEACHER_NOTES_BY_STUDENT, {
    studentId: args.studentId,
    limit: args.limit ?? 10,
  });
  const items = data?.teacherNotesByStudentId?.items ?? [];

  return {
    studentId: args.studentId,
    count: items.length,
    notes: items.map((n) => ({
      title: n.title ?? "(untitled)",
      body: n.body,
      category: n.category ?? "GENERAL",
      createdAt: n.createdAt,
    })),
  };
}

async function execute_get_student_incidents(args, context) {
  const guard = assertStudentBelongsToParent(args.studentId, context);
  if (guard) return guard;

  const data = await gql(INCIDENTS_BY_STUDENT, {
    studentId: args.studentId,
    limit: args.limit ?? 20,
  });
  const items = data?.incidentsByStudentId?.items ?? [];

  return {
    studentId: args.studentId,
    count: items.length,
    incidents: items.map((i) => ({
      date: i.date,
      description: i.description,
      severity: i.severity ?? "UNSPECIFIED",
    })),
  };
}

async function execute_get_student_enrollments(args, context) {
  const guard = assertStudentBelongsToParent(args.studentId, context);
  if (guard) return guard;

  const data = await gql(ENROLLMENTS_BY_STUDENT, { studentId: args.studentId });
  const items = data?.enrollmentsByStudentId?.items ?? [];

  return {
    studentId: args.studentId,
    count: items.length,
    enrollments: items.map((e) => ({
      classId: e.classId,
      className: e.class?.name ?? "(unknown class)",
      teacherName: e.class?.teacher?.name ?? "(unknown teacher)",
      currentGrade: e.currentGrade,
    })),
  };
}

async function execute_get_class_schedule(args, context) {
  // We allow looking up schedules for any class a parent's child is
  // enrolled in. We validate by checking the class appears in the
  // context we built at session start.
  const allowedClassIds = new Set(
    (context.classes || []).map((c) => c.id)
  );
  if (!allowedClassIds.has(args.classId)) {
    return {
      error: `Access denied: class ${args.classId} is not a class your children are enrolled in.`,
    };
  }

  const data = await gql(SCHEDULES_BY_CLASS, { classId: args.classId });
  const items = data?.schedulesByClassId?.items ?? [];

  return {
    classId: args.classId,
    schedules: items.map((s) => ({
      dayOfWeek: s.dayOfWeek,
      startTime: s.startTime,
      endTime: s.endTime,
    })),
  };
}

async function execute_summarize_week(args, context) {
  const guard = assertStudentBelongsToParent(args.studentId, context);
  if (guard) return guard;

  // Run the three sub-fetches in parallel,significantly faster than
  // three sequential tool round-trips to OpenAI.
  const [attendance, notes, incidents] = await Promise.all([
    execute_get_student_attendance({ studentId: args.studentId, daysBack: 7 }, context),
    execute_get_teacher_notes({ studentId: args.studentId, limit: 5 }, context),
    execute_get_student_incidents({ studentId: args.studentId, limit: 5 }, context),
  ]);

  return {
    studentId: args.studentId,
    windowDays: 7,
    attendance: attendance.counts,
    recentNotes: notes.notes.slice(0, 5),
    recentIncidents: incidents.incidents.slice(0, 5),
  };
}

const TOOL_EXECUTORS = {
  get_student_attendance: execute_get_student_attendance,
  get_teacher_notes: execute_get_teacher_notes,
  get_student_incidents: execute_get_student_incidents,
  get_student_enrollments: execute_get_student_enrollments,
  get_class_schedule: execute_get_class_schedule,
  summarize_week: execute_summarize_week,
};

/**
 * Dispatch a tool call to its executor.
 *
 * @param {string} name - Tool name requested by the model
 * @param {object} args - Parsed arguments from the model
 * @param {object} context - Session context (parent + students + classes)
 * @returns {Promise<object>} Tool result (serialized to JSON for the model)
 */
async function executeTool(name, args, context) {
  const executor = TOOL_EXECUTORS[name];
  if (!executor) {
    return { error: `Unknown tool: ${name}` };
  }
  try {
    return await executor(args, context);
  } catch (err) {
    console.error(`Tool ${name} failed:`, err);
    return {
      error: `Tool ${name} failed: ${err.message}. Tell the parent you're having trouble accessing that data right now.`,
    };
  }
}

module.exports = { TOOL_DEFINITIONS, executeTool };
