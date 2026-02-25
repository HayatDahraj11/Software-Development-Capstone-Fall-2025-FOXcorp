
// hardcoded parent and children data, used for the debug accounts
// and any other testing without database integration
import { Parent, Student, Class, Enrollment, Teacher_parentSide } from "src/features/fetch-user-data/api/parent_data_fetcher";

// constants, makes these easier to reference or change
const debug_student_ids: string[] = ["123", "124"]
const debug_teacher_ids: string[] = ["debug_teacher_1", "debug_teacher_2", "debug_teacher_3"]
const debug_class_ids: string[] = ["debug_math", "debug_pe", "debug_history", "debug_reading"]

// two hardcoded children with information that lines up with the class diagrams
export const debug_kids: Student[] = [
    {
        id: debug_student_ids[0],
        firstName: "Darcey",
        lastName: "Incredible",
        gradeLevel: 2,
        currentStatus: "in-class",
        attendanceRate: 100,
    },
    {
        id: debug_student_ids[1],
        firstName: "Daan",
        lastName: "Incredible",
        gradeLevel: 1,
        attendanceRate: 89,
    },
]

// the hardcoded user with information that lines up with the class diagrams
export const debug_parent: Parent = {
    userId: "debug",
    firstName: "debug dude",
    lastName: "Parental",
    studentIds: [debug_kids[0].id, debug_kids[1].id]
}

// hardcoded class data
export const debug_classes: Class[] = [
    {
        id: debug_class_ids[0],
        name: "Reading",
        schoolId: "school_1",
        teacherId: debug_teacher_ids[0],
    },
    {
        id: debug_class_ids[1],
        name: "Physical Ed.",
        schoolId: "school_1",
        teacherId: debug_teacher_ids[1],
    },
    {
        id: debug_class_ids[2],
        name: "History",
        schoolId: "school_1",
        teacherId: debug_teacher_ids[1],
    },
    {
        id: debug_class_ids[3],
        name: "Math",
        schoolId: "school_1",
        teacherId: debug_teacher_ids[2],
    },

]

// hardcoded teacher data
export const debug_teachers: Teacher_parentSide[] = [
    {
        id: debug_teacher_ids[0],
        //firstname: "Shawn",
        //lastname: "Randal",
        //honorific: "Mr.",
        name: "Mr. Randal",
        schoolId: "school_1"
    },
    {
        id: debug_teacher_ids[1],
        //firstname: "Chantelle",
        //lastname: "Beck",
        //honorific: "Mrs.",
        name: "Mrs. Beck",
        schoolId: "school_1"
    },
    {
        id: debug_teacher_ids[2],
        //firstname: "Claire",
        //lastname: "Good",
        //honorific: "Ms.",
        name: "Ms. Good",
        schoolId: "school_1"
    },
]

// hardcoded enrollment data
export const debug_enrollments: Enrollment[] = [
    {
        id: "debug_enrollment_s0-c0", // "s0-c0" means "student in index 0 to class in index 0"
        studentId: debug_student_ids[0],
        classId: debug_class_ids[0],
        currentGrade: 100
    },
    {
        id: "debug_enrollment_s0-c1",
        studentId: debug_student_ids[0],
        classId: debug_class_ids[1],
        currentGrade: 84
    },
    {
        id: "debug_enrollment_s0-c2",
        studentId: debug_student_ids[0],
        classId: debug_class_ids[2],
        currentGrade: 72
    },
    {
        id: "debug_enrollment_s1-c0",
        studentId: debug_student_ids[1],
        classId: debug_class_ids[0],
        currentGrade: 70
    },
    {
        id: "debug_enrollment_s1-c1",
        studentId: debug_student_ids[1],
        classId: debug_class_ids[1],
        currentGrade: 98
    },
    {
        id: "debug_enrollment_s1-c2",
        studentId: debug_student_ids[1],
        classId: debug_class_ids[2],
        currentGrade: 65
    },
]