
// hardcoded teacher and class data, used for the debug accounts
// and any other testing without database integration

import { Teacher, Class, Enrollment, Student } from "src/features/fetch-user-data/api/teacher_data_fetcher";

// two hardcoded classes with information that lines up with the class diagrams
export const debug_students: Student[] = [
    {
        id: "1",
        firstName: "Darcey",
        lastName: "Incredible",
        gradeLevel: 2,
        currentStatus: "in-class",
        attendanceRate: 100,
    },
    {
        id: "2",
        firstName: "Daan",
        lastName: "Incredible",
        gradeLevel: 1,
        attendanceRate: 89,
    },
]

const debug_enrollments: Enrollment[] = [
    {
        id: "enroll-1",
        studentId: "1",
        classId: "class-101",
        student: debug_students[0]
    },
    {
        id: "enroll-2",
        studentId: "2",
        classId: "class-101",
        student: debug_students[1]
    }
];


export const debug_classes: Class[] = [
    {
        id: "class-101",
        name: "Math 101",
        teacherId: "debug",
        schoolId: "school-1",
        enrollments: debug_enrollments.filter(e => e.classId === "class-101"),
    },
    {
        id: "class-102",
        name: "History 201",
        teacherId: "debug",
        schoolId: "school-1",
        enrollments: debug_enrollments.filter(e => e.classId === "class-102"), 
    }
];

// the hardcoded user with information that lines up with the class diagrams
export const debug_teacher: Teacher = {
    userId: "debug",
    name: "Debug Teacher",
    classIds: [debug_classes[0].id, debug_classes[1].id]
}
