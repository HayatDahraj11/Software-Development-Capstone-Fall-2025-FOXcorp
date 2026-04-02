import { Href, useFocusEffect, useRouter } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { Platform, ScrollView, Text, View } from "react-native";

import { containerStyle, dropdownStyle } from "@/src/features/app-themes/constants/stylesheets";
import { useThemeColor } from "@/src/features/app-themes/logic/use-theme-color";
import { DataCard, createStudentAttendanceCard, createStudentClassUpdateCard } from "@/src/features/cards/logic/cardDataCreator";
import Card from "@/src/features/cards/ui/Card";
import { useParentLoginContext } from "@/src/features/context/ParentLoginContext";
import { Student, Teacher_parentSide } from "@/src/features/fetch-user-data/api/parent_data_fetcher";
import {
  Option,
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/src/rnreusables/ui/select';
import type { TriggerRef } from '@rn-primitives/select';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function ParentLiveUpdatesScreen() {
  // context givent parent and student data
  const {
      userParent,
      userStudents,
      userClasses,
      userEnrollments,
      userTeachers,
      getClassesMappedByStudent,
      getTeacherNamebyId,
      getStudentGradeInClass,
      getChosenStudentId,
      getChosenStudentIndex,
  } = useParentLoginContext();

  
  // colors grabbed by app theme
  const bgcolor = useThemeColor({}, "background");
  const cardbgcolor = useThemeColor({}, "cardBackground");
  const tabiconcolor = useThemeColor({}, "tabIconDefault");
  const textcolor = useThemeColor({}, "text");
  const tintcolor = useThemeColor({}, 'tint');
  const listtextcolor = useThemeColor({}, "listText");
  const subtextcolor = useThemeColor({}, "placeholderText");
  const modalbgcolor = useThemeColor({}, "modalBackground");

  const [screenCards, setScreenCards] = useState<DataCard[]>([]);

    // this holds which child of the parent's is currently being displayed
  const [childSelected, setChildSelected] = useState<Student>(userStudents[getChosenStudentIndex()]);
  const [childIdSelected, setChildIdSelected] = useState<Option>({value: userStudents[getChosenStudentIndex()].id, label: userStudents[getChosenStudentIndex()].firstName})
  const [childClasses, setChildClasses] = useState<{classId: string; className: string; teacherId: string; teacherName: string; grade: number}[]>()
  const [gradeDisplay, setGradeDisplay] = useState<number | undefined>();

  const firstLoad = useCallback(async () => {
    let cardset: DataCard[] = []

    // go through each student and generate relevant cards for them
    for(const stu of userStudents) {
      const firstEnrollment = userEnrollments.find(enrollment => enrollment.studentId === stu.id) // finding the first enrollment this student is enrolled in
      const firstClass = userClasses.find(theclass => theclass.id === firstEnrollment?.classId)
      // this will call aws if there is a firstClass
      let tempTeach: Teacher_parentSide
      if(firstClass) {
        const temptemp = userTeachers.find(teach => teach.id === firstClass.teacherId);
        if(temptemp) {
          tempTeach = temptemp;
        } else {
          tempTeach = {id: "error", name: "error", schoolId: "error"};
        }
      } else {
        tempTeach = {id: "error", name: "error", schoolId: "error"};
      }

      if(firstEnrollment && firstClass) {
        // calling external function to handle creating data that goes into the card
        const classCard = createStudentClassUpdateCard(stu, firstClass, firstEnrollment, tempTeach)
        cardset.push(classCard);
      }

      const attendanceCard = createStudentAttendanceCard(stu);
      cardset.push(attendanceCard);
    }
    
    setScreenCards(cardset);
  }, [userClasses, userEnrollments, userStudents, userTeachers])

  useEffect(() => {
    firstLoad();
  }, [])

  
  const router = useRouter();

  const RouteCard = (route: string): void => {
        // if card has a route, use it. if not, ignore it
        if(route !== " ") { 
            router.push( (route) as Href );
        }
        else { }
  };



  // stuff for select button
  const ref = useRef<TriggerRef>(null);
  const insets = useSafeAreaInsets();
  const contentInsets = {
    top: insets.top,
    bottom: Platform.select({ios: insets.bottom, android: insets.bottom + 24}),
    left: 12,
    right: 12,
  };
  function onTouchStart() {
    ref.current?.open();
  }

  // grabbing child selected data aswell as their classes
  const onChildSelected = useCallback((id: string) => {
    let foundKid = userStudents.find(item => item.id === id);
    if(foundKid) {
      foundKid = {
        id: foundKid.id,
        firstName: foundKid.firstName,
        lastName: foundKid.lastName,
        gradeLevel: foundKid.gradeLevel,
        currentStatus: foundKid.currentStatus,
        attendanceRate: foundKid.attendanceRate
      }
      setChildSelected(foundKid);

      const classIds = getClassesMappedByStudent(id);

      const scheduleRows = classIds
          .map((classId) => {
              const cls = userClasses.find((c) => c.id === classId);
              if (!cls) return null;
              const teacherName = getTeacherNamebyId(cls.teacherId);
              const grade = getStudentGradeInClass(id, classId);
              return { classId, className: cls.name, teacherName, grade };
          })
          .filter(Boolean) as { classId: string; className: string; teacherId: string; teacherName: string; grade: number }[];
    
      setChildClasses(scheduleRows);
      const grade = scheduleRows[0].grade;
      setGradeDisplay(grade);
      
    } else {
      console.warn("Somehow, a kid was selected that didn't exist. onChildSelected()")
    }

  }, [getClassesMappedByStudent, getStudentGradeInClass, getTeacherNamebyId, userClasses, userStudents]);
  useEffect(() => { // this will update child selected when a new child is selected...
    if(childIdSelected) {
      onChildSelected(childIdSelected?.value);
    }
  }, [childIdSelected, onChildSelected])

  // states for filtering the flatlist by kid
  // made with help from gemini
  const [filteredList, setFilteredList] = useState(screenCards);
  const [fullList, setFullList] = useState(screenCards)

  useEffect(() => {
    // if "Display All" is selected
    if(childSelected.id === '0') {
      setFilteredList(screenCards); // then display all the cards available
    }
    else {
      // when childSelected is changed, this will parse through the card list and select ones with matching studentIds
      for(let i = 0; i<screenCards.length; i++) {
        const newFilteredData = screenCards.filter(item => 
          item.itemId.match(childSelected.id)
        );
        setFilteredList(newFilteredData);
      }
    }
    
  }, [childSelected, fullList, screenCards])

  // updates the student selected on screen focus
  useFocusEffect(
    useCallback(() => {
      setChildSelected(userStudents[getChosenStudentIndex()]);
      setChildIdSelected({value: userStudents[getChosenStudentIndex()].id, label: userStudents[getChosenStudentIndex()].firstName})
    }, [getChosenStudentIndex, userStudents])
  )

  return (
    <View style={[containerStyle.container, {backgroundColor: bgcolor}]}>
      <ScrollView contentContainerStyle={containerStyle.scrollContent} showsVerticalScrollIndicator={false}>

        {/* Select Student Dropdown */}
        <View style={containerStyle.headerContainer}>
          <Select value={childIdSelected} style={[dropdownStyle.dropdownContainer]} onValueChange={setChildIdSelected}>
            <SelectTrigger ref={ref} style={[dropdownStyle.dropdownButton, {backgroundColor: cardbgcolor}]} onTouchStart={Platform.select({web: onTouchStart})}>
              <SelectValue style={[dropdownStyle.dropdownLabel, {color: textcolor}]} placeholder={childSelected.firstName} />
            </SelectTrigger>
            <SelectContent insets={contentInsets} style={{backgroundColor: cardbgcolor}} >
              <SelectGroup>
                <SelectLabel style={{color: tintcolor}}>Select a Student</SelectLabel>
                {userStudents.map((stu) => (
                  <SelectItem key={stu.id} label={stu.firstName} value={stu.id}>
                    {stu.firstName}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </View>

        {/* Current Class Card */}
        <Text style={[containerStyle.sectionLabel, {color: subtextcolor}]}>CURRENT CLASS</Text>
        {(childClasses !== undefined && childClasses[0] !== null) ? (  // For now, it will default render the first class of the student. When we have class times setup, it will display the correct class that aligns with the current time
          <Card 
            header={childClasses[0].className}
            preview={childClasses[0].teacherName}
            onPress={() => {/* todo class popup */}}
            urgent={true}
            pressable={true}
            icon={{name: "book", size: 22, color: tintcolor, backgroundColor: (tintcolor+20)}}
            badge={
              (gradeDisplay !== null && gradeDisplay !== undefined) ? (
                {type: 0, content: `${gradeDisplay}%`, contentColor: gradeDisplay >= 90 ? "#16a34a" : gradeDisplay >= 70 ? "#d97706" : "#dc2626", backgroundColor: gradeDisplay >= 90 ? "#22c55e20" : gradeDisplay >= 70 ? "#f59e0b20" : "#ef444420"}
              ) : (undefined)
            }
          />
        ) : (
          <View style={containerStyle.empty}>
            <Text style={{color: subtextcolor, fontSize: 16}}>Student is Not In Class</Text>
          </View>
        )
        }

        {/* Relevant Announcements or Alerts Section */}
        <View>
          <Text style={[containerStyle.sectionLabel, {color: subtextcolor}]}>ANNOUNCEMENTS and ALERTS</Text>
          <Text style={{color: textcolor}}>tbd!</Text>
        </View>


        {/* Relevant Teacher Updates or Notes Section */}
        <View>
          <Text style={[containerStyle.sectionLabel, {color: subtextcolor}]}>TEACHER NOTES</Text>
          <Text style={{color: textcolor}}>tbd!</Text>
        </View>

      </ScrollView>
    </View>
  );
}

