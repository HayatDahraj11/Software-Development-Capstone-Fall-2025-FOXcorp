// holds functions for talking to aws backend
// and fetching relavent teacher data from it
// this assumes you are past the login screen!
// this accounts for debug accounts
import { generateClient } from 'aws-amplify/api';
import { listTeachers, getTeacher, listStudents, listClasses} from '@/src/graphql/queries';

const client = generateClient();

export type Student = {
    id: string;
    firstName: string;
    lastName: string;
    gradeLevel?: number | null;
    currentStatus?: string | null;
    attendanceRate?: number | null;
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
    students?: Student[]; //Classes?? Enrollment?? CHANGE
}

// pulls the client's teacher data and student(s) data
// returns a bool denoting if the pull was successful
// on success, also returns Teacher object and array of Student objects
export async function fetchTeacherWithKids(): Promise<BackendQueryResult> {
    try {
        // get the teacher's information
        const result = await client.graphql({query: listTeachers});
        const teachers = result.data.listTeachers.items;
        const teacher = teachers[0];
        const userId = teacher.id;

        // get the students information
        // note: a client should only have access to their students, so this will only fetch the teacher's students
        const studentResults = await client.graphql({query: listStudents});
        const students = studentResults.data.listStudents.items;
        const studentIds: string[] = students.map(item => item.id);

        // creating typed objects out of retrieved data to be passed up
        const teacherData: Teacher = {
            userId: userId,
            name: teacher.name,
            classIds: studentIds
        };
        let studentsData: Student[] = []
        // this parses through students because a teacher can have more than one student!
        // but this also works if teacher only has one student.
        for(const stu of students) {
            const temp: Student = {
                id: stu.id,
                firstName: stu.firstName,
                lastName: stu.lastName,
                gradeLevel: stu.gradeLevel,
                currentStatus: stu.currentStatus,
                attendanceRate: stu.attendanceRate,
            };
            studentsData.push(temp);
        }

        const returnMessage: string = "Teacher and Student data found with "+studentsData.length+" students."
        return { success: true, message: returnMessage, teacher: teacherData, students: studentsData }

        
    } catch(e) {
        const err = e as {name?: string, message?: string};
        console.error("teacher_data_fetcher.ts, fetchTeacherWithKids(): ", err.message);
        return { success: false, message: "See logs for error." };
    }
}

