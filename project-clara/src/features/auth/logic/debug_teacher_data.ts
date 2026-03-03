
// hardcoded teacher and class data, used for the debug accounts
// and any other testing without database integration

import { Teacher, Class } from "src/features/fetch-user-data/api/teacher_data_fetcher";

// two hardcoded children with information that lines up with the class diagrams
export const debug_classes: Class[] = [
    {
        id: "class-101",
        name: "Math 101",
        teacherId: "debug",
        schoolId: "school-1",
    },
    {
        id: "class-102",
        name: "History 201",
        teacherId: "debug",
        schoolId: "school-1",
    }
];

// the hardcoded user with information that lines up with the class diagrams
//THIS WILL NOT BE THE DATA IN TEACHER
export const debug_teacher: Teacher = {
    userId: "debug",
    name: "Debug Teacher",
    classIds: [debug_classes[0].id, debug_classes[1].id]
}
