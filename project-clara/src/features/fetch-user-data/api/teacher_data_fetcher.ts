// holds functions for talking to aws backend
// and fetching relavent teacher data from it
// this assumes you are past the login screen!
// this accounts for debug accounts
import { generateClient } from 'aws-amplify/api';
import { listTeachers, getTeacher, listStudents, listClasses} from '@/src/graphql/queries';

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

        // get the students information
        // note: a client should only have access to their students, so this will only fetch the teacher's students
        const classResult: any = await client.graphql({
            query: listClasses,
            variables: {
                filter: { teacherId: { eq: teacherId } }
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
                student: e.student
                    ? {
                        id: e.student.id,
                        firstName: e.student.firstName,
                        lastName: e.student.lastName
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

