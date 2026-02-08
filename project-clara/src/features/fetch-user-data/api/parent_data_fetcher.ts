// holds functions for talking to aws backend
// and fetching relavent parent data from it
// this assumes you are past the login screen!
// this accounts for debug accounts
import { generateClient } from 'aws-amplify/api';
import { listParents, getParent, listStudents, getStudent, listSchools, parentStudentsByParentId } from '@/src/graphql/queries';

const client = generateClient();

export type Student = {
    id: string;
    firstName: string;
    lastName: string;
    gradeLevel?: number | null;
    currentStatus?: string | null;
    attendanceRate?: number | null;
};

export type Parent = {
    userId: string;
    firstName: string;
    lastName: string;
    studentIds: string[]; // an array of all id's of the children this parent has
};

export type BackendQueryResult = {
    success: boolean; // true implies that parent? and students? exist, false implies they don't
    message: string;
    parent?: Parent;
    students?: Student[];
}

// pulls the client's parent data and student(s) data
// returns a bool denoting if the pull was successful
// on success, also returns Parent object and array of Student objects
export async function fetchParentWithKids(): Promise<BackendQueryResult> {
    try {
        // get the parent's information
        const result = await client.graphql({query: listParents});
        const parents = result.data.listParents.items;
        const parent = parents[0];
        const userId = parent.id;

        // get the students information
        // note: a client should only have access to their students, so this will only fetch the parent's students
        const studentResults = await client.graphql({query: listStudents});
        const students = studentResults.data.listStudents.items;
        const studentIds: string[] = students.map(item => item.id);

        // creating typed objects out of retrieved data to be passed up
        const parentData: Parent = {
            userId: userId,
            firstName: parent.firstName,
            lastName: parent.lastName,
            studentIds: studentIds
        };
        let studentsData: Student[] = []
        // this parses through students because a parent can have more than one student!
        // but this also works if parent only has one student.
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

        const returnMessage: string = "Parent and Student data found with "+studentsData.length+" students."
        return { success: true, message: returnMessage, parent: parentData, students: studentsData }

        
    } catch(e) {
        const err = e as {name?: string, message?: string};
        console.error("parent_data_fetcher.ts, fetchParentWithKids(): ", err.message);
        return { success: false, message: "See logs for error." };
    }
}

