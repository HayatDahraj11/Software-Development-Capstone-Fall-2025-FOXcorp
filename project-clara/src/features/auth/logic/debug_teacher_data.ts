
// hardcoded parent and children data, used for the debug accounts
// and any other testing without database integration

// two hardcoded children with information that lines up with the class diagrams
/*export const debug_kids = {
    firstChildInfoDictionary: {
        studentId: "123",
        firstName: "Darcey",
        lastName: "Incredible",
        dob: "temp",
        classes: ["English", "Maths", "Mario"],
        attendanceRate: 100,
    },
    secondChildInfoDictionary: {
        studentId: "124",
        firstName: "Daan",
        lastName: "Incredible",
        dob: "temp",
        classes: ["History", "Maths"],
        attendanceRate: 89,
    },
}*/

// the hardcoded user with information that lines up with the class diagrams
//THIS WILL NOT BE THE DATA IN TEACHER
export const debug_teacher = {
    teacherUser: {
        userId: "debug",
        teacherId: "12",
        canEditRecords: true,
        //students:
        //classes:
        updateStudentInfo : function(studentId: string) {
            console.log("updateStudentInfo called but this function is not made yet! sorry!")
        }
    }
}
