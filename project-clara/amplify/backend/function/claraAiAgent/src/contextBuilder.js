/**
 * contextBuilder.js
 *
 * At the start of every Clara invocation we build a "session context"
 * containing the parent, their children, and the classes their children
 * are enrolled in. This context is:
 *
 *   1. Injected into the system prompt so Clara knows who she's talking
 *      to and which students are in scope.
 *
 *   2. Used as an authorization allow-list inside every tool,tools
 *      refuse to return data for a student not in the context.
 *
 * Building this once up front is cheaper than having the model call a
 * "list_my_children" tool every conversation.
 */

const { gql } = require("./graphqlClient");

// Parent + their linked students. Uses the ParentStudents join table
// that @manyToMany generates automatically.
const GET_PARENT_CONTEXT = /* GraphQL */ `
  query GetParentContext($parentId: ID!) {
    getParent(id: $parentId) {
      id
      firstName
      lastName
      students {
        items {
          student {
            id
            firstName
            lastName
            gradeLevel
            dateOfBirth
          }
        }
      }
    }
  }
`;

// Once we know the student IDs we also pull their enrollments so we can
// name the classes and teachers in the system prompt, and so tool-call
// authorization can validate classIds too.
const ENROLLMENTS_FOR_STUDENT = /* GraphQL */ `
  query EnrollmentsForStudent($studentId: ID!) {
    enrollmentsByStudentId(studentId: $studentId) {
      items {
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

/**
 * Build the session context for a parent.
 *
 * @param {string} parentId
 * @returns {Promise<{ parent, students, classes }>}
 */
async function buildContext(parentId) {
  const data = await gql(GET_PARENT_CONTEXT, { parentId });
  const parent = data?.getParent;

  if (!parent) {
    throw new Error(`Parent not found: ${parentId}`);
  }

  // Flatten the @manyToMany join table down to plain student objects
  const students = (parent.students?.items ?? [])
    .map((edge) => edge.student)
    .filter(Boolean);

  // Gather classes (deduped) so we can enrich the system prompt and
  // authorize get_class_schedule calls.
  const classesById = new Map();

  // Parallel fetch of all children's enrollments
  const enrollmentResults = await Promise.all(
    students.map((s) =>
      gql(ENROLLMENTS_FOR_STUDENT, { studentId: s.id }).catch(() => null)
    )
  );

  for (let i = 0; i < students.length; i++) {
    const enrs = enrollmentResults[i]?.enrollmentsByStudentId?.items ?? [];
    // Attach to student (for system-prompt rendering)
    students[i].classes = enrs
      .map((e) => {
        if (!e.class) return null;
        classesById.set(e.class.id, {
          id: e.class.id,
          name: e.class.name,
          teacherName: e.class.teacher?.name,
        });
        return {
          id: e.class.id,
          name: e.class.name,
          teacherName: e.class.teacher?.name,
        };
      })
      .filter(Boolean);
  }

  return {
    parent: {
      id: parent.id,
      firstName: parent.firstName,
      lastName: parent.lastName,
    },
    students,
    classes: Array.from(classesById.values()),
  };
}

module.exports = { buildContext };
