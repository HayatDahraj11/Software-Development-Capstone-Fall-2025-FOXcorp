// holds functions for talking to aws backend
// and fetching relavent teacher data from it
// this assumes you are past the login screen!
// this accounts for debug accounts
import { generateClient } from 'aws-amplify/api';
import { listTeachers } from '@/src/graphql/queries';

const client = generateClient();

export type Class = {
    id: string;
    name: string;
    teacherId: string;
    schoolId: string;
    enrollments?: Enrollment[];
};

export type Student = {
    id: string;
    firstName: string;
    lastName: string;
    gradeLevel?: number | null;
    currentStatus?: string | null;
    attendanceRate?: number | null;
};

export type Enrollment = {
    id: string;
    studentId: string;
    classId: string;
    currentGrade?: number | null;
    student?: Student;
};

export type Teacher = {
    userId: string;
    name: string;
    classIds: string[]; // an array of all id's of the classes this teacher teaches
};

export type BackendQueryResult = {
    success: boolean; // true implies that teacher? and students? exist, false implies they don't
    message: string;
    teacher?: Teacher;
    classes?: Class[];
}

// the generated listClasses query doesnt include enrollments or students
// so we need this custom query that goes deeper and grabs everything we need
const listClassesWithEnrollments = /* GraphQL */ `
  query ListClasses($filter: ModelClassFilterInput, $limit: Int) {
    listClasses(filter: $filter, limit: $limit) {
      items {
        id
        name
        teacherId
        schoolId
        enrollments {
          items {
            id
            studentId
            classId
            currentGrade
            student {
              id
              firstName
              lastName
              gradeLevel
              currentStatus
              attendanceRate
            }
          }
        }
      }
    }
  }
`;

// pulls the client's teacher data and student(s) data
// returns a bool denoting if the pull was successful
// on success, also returns Teacher object and array of Student objects
export async function fetchTeacherWithClass(): Promise<BackendQueryResult> {
    try {
        // get the teacher's information
        const result = await client.graphql({query: listTeachers});
        const teachers = result.data.listTeachers.items;
        const teacher = teachers[0];
        const teacherId = teacher.id;

        // fetch classes with the full enrollment and student data nested in
        const classResult: any = await client.graphql({
            query: listClassesWithEnrollments,
            variables: {
                filter: { teacherId: { eq: teacherId } },
                limit: 100
            }
        });

        const classes = classResult.data.listClasses.items;

        const classIds: string[] = classes.map((c: any) => c.id);

        //creating typed objects out of retrieved data to be passed up
        const teacherData: Teacher = {
            userId: teacherId,
            name: teacher.name,
            classIds: classIds
        };

        const classesData: Class[] = classes.map((c: any) => ({
            id: c.id,
            name: c.name,
            teacherId: c.teacherId,
            schoolId: c.schoolId,
            enrollments: c.enrollments?.items?.map((e: any) => ({
                id: e.id,
                studentId: e.studentId,
                classId: e.classId,
                currentGrade: e.currentGrade ?? null,
                student: e.student
                    ? {
                        id: e.student.id,
                        firstName: e.student.firstName,
                        lastName: e.student.lastName,
                        gradeLevel: e.student.gradeLevel ?? null,
                        currentStatus: e.student.currentStatus ?? null,
                        attendanceRate: e.student.attendanceRate ?? null,
                    }
                    : undefined
            })) ?? []
        }));


        const returnMessage = `Teacher and Class data found with ${classesData.length} classes.`;
        return { success: true, message: returnMessage, teacher: teacherData, classes: classesData }


    } catch(e) {
        const err = e as {name?: string, message?: string};
        console.error("teacher_data_fetcher.ts, fetchTeacherWithClasses(): ", err.message);
        return { success: false, message: "See logs for error." };
    }
}

