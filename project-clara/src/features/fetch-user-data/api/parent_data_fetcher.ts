// holds functions for talking to aws backend
// and fetching relavent parent data from it
// this assumes you are past the login screen!
// this accounts for debug accounts
import { generateClient } from 'aws-amplify/api';
import { listParents, getParent, listStudents, getStudent, listSchools, parentStudentsByParentId, listClasses, listEnrollments, getTeacher } from '@/src/graphql/queries';

const client = generateClient();

/* Object Types */

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

export type Teacher = {
    id: string;
    //firstName: string;
    //lastName: string;
    //honorific: string; // like Mr., Mrs., Ms.
    name: string; // for now, just this, because for some reason this is the only name var in this table
    schoolId: string;
};

export type Class = {
    id: string;
    name: string;
    schoolId: string;
    teacherId: string;
};

// weird type!
// an object of this type simply holds the connection between a student and a class
// aswell as any relevant information from said connection, like student's grade
export type Enrollment = {
    id: string; // to be honest, I don't know what this id is for in this context. holding anyway!
    studentId: string;
    classId: string;
    currentGrade?: number | null;
}

/* Promise Return Types */

export type ParentStudentFetchResult = {
    success: boolean; // true implies that parent? and students? exist, false implies they don't
    message: string;
    parent?: Parent;
    students?: Student[];
};

export type StudentClassesFetchResult = {
    success: boolean; // true implies that classes? exists
    message: string;
    classes?: Class[];
    enrollments?: Enrollment[]; // object that ties a studentId to a classId
};

export type TeacherIDFetchResult = {
    success: boolean;
    message: string;
    teacher?: Teacher
}

// pulls the client's parent data and student(s) data
// returns a bool denoting if the pull was successful
// on success, also returns Parent object and array of Student objects
export async function fetchParentWithKids(): Promise<ParentStudentFetchResult> {
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
        return { success: false, message: `${err.message}` };
    }
}

// pulls client's student's Class information
// this is used by Parents who have Students
// the using of this assumes a parent is logged in 
export async function fetchClassesForStudents(): Promise<StudentClassesFetchResult> {
    try {
        // grabbing class information
        // note: this assumes that classes are only accessible to Parents whose Students are within said classes
        const classesResults = await client.graphql({query: listClasses});
        const classes = classesResults.data.listClasses.items;

        let classesData: Class[] = []

        for(const cla of classes) {
            const temp: Class = {
                id: cla.id,
                name: cla.name,
                schoolId: cla.schoolId,
                teacherId: cla.teacherId,
            }
            classesData.push(temp);
        }

        const enrollmentsResults = await client.graphql({query: listEnrollments});
        const enrollments = enrollmentsResults.data.listEnrollments.items;

        let enrollmentsData: Enrollment[] = []

        for(const enr of enrollments) {
            const temp: Enrollment = {
                id: enr.id,
                studentId: enr.studentId,
                classId: enr.classId,
                currentGrade: enr.currentGrade,
            }
            enrollmentsData.push(temp);
        }

        const returnMessage: string = "Class and Enrollment data found with "+enrollmentsData.length+" enrollments and "+classesData.length+" classes."
        return { success: true, message: returnMessage, classes: classesData, enrollments: enrollmentsData };
    } catch(e) {
        const err = e as {name?: string, message?: string};
        console.error("parent_data_fetcher.ts, fetchClassesByStudent(): ", err.message);
        return { success: false, message: `${err.message}` };
    }
}

// grabbing teacher data based on teacherid
export async function fetchTeacherByID(teacherid: string): Promise<TeacherIDFetchResult> {
    try {
        // grabbing teacher info
        const teacherResults = await client.graphql({query: getTeacher, variables: {id: teacherid}})
        const teacher = teacherResults.data.getTeacher

        if(teacher) {
            const teacherData: Teacher = {
                id: teacher.id,
                name: teacher.name,
                schoolId: teacher.schoolId
            }
            
            const returnMessage: string = "Teacher data found for "+teacherData.name+".";
            return { success: true, message: returnMessage, teacher: teacherData };
        } else {
            throw new Error("Teacher not pulled. Is null / query wrong.");
        }

    } catch(e) {
        const err = e as {name?: string, message?: string};
        console.error("parent_data_fetcher.ts, fetchTeachersForStudents(): ", err.message);
        return { success: false, message: `${err.message}` };
    }
}