// this holds functions for creating cards based on passed in info
// this abstracts commonly created cards to one file which holds all of the functions
    // for their creation
import { Enrollment, Student, Class, Teacher_parentSide } from "../../fetch-user-data/api/parent_data_fetcher";

// object type of a card
export type DataCard = {
  id: number;
  header: string;
  preview: string;
  route: string;
  urgent?: boolean;
  theme?: string;
  itemId: string; // if the card will have a particular value to distinguish itself, like a studentId it is referencing, store that here
}

let NEXT_CARD_ID: number = 0

// creating data for a card which displays information about a student's current location
export function createStudentClassUpdateCard(stu: Student, cla: Class, enr: Enrollment, teach: Teacher_parentSide, route?: string): DataCard {
    const router: string = route ? route : " ";

    // creating the data which will be put into a card
    const card: DataCard = {
        id: NEXT_CARD_ID,
        header: `${stu.firstName} is in ${cla.name} with ${teach.name} until [classEndTime]`,
        preview: `They have a ${enr.currentGrade} in the class.`,
        route: router,
        urgent: true,
        itemId: stu.id,
    };

    NEXT_CARD_ID+=1

    return card;
}

// creating data for a card which displays information about a student's current attendance
export function createStudentAttendanceCard(stu: Student, route?: string): DataCard {
    const attendanceMessage: string = stu.attendanceRate === 100 ? `${stu.firstName} has had a perfect attendance today!` : `${stu.firstName} has missed classes today!`
    const router: string = route ? route : " ";

    const card: DataCard = {
        id: NEXT_CARD_ID,
        header: attendanceMessage,
        preview: "",
        route: router,
        urgent: false,
        itemId: stu.id,
    };

    NEXT_CARD_ID+=1;

    return card;
}

export function createStudentClassListCard(cla: Class, teacherName: string): DataCard {
    // route is empty
    // itemId is the class's classId

    const card: DataCard = {
        id: NEXT_CARD_ID,
        header: cla.name,
        preview: teacherName,
        route: "",
        theme: "list",
        itemId: cla.id,
    };

    NEXT_CARD_ID+=1;

    return card;
}