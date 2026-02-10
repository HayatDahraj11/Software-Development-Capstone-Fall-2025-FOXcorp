
// hardcoded parent and children data, used for the debug accounts
// and any other testing without database integration
import { Parent, Student } from "src/features/fetch-user-data/api/parent_data_fetcher";

// two hardcoded children with information that lines up with the class diagrams
export const debug_kids: Student[] = [
    {
        id: "123",
        firstName: "Darcey",
        lastName: "Incredible",
        gradeLevel: 2,
        currentStatus: "in-class",
        attendanceRate: 100,
    },
    {
        id: "124",
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
