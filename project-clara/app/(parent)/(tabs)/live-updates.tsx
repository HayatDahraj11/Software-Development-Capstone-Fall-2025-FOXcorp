import { Href, useFocusEffect, useRouter } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { ActivityIndicator, Platform, ScrollView, Text, View } from "react-native";

import { useParentAnnouncements } from "@/src/features/announcements/logic/useParentAnnouncements";
import { containerStyle, dropdownStyle } from "@/src/features/app-themes/constants/stylesheets";
import { useThemeColor } from "@/src/features/app-themes/logic/use-theme-color";
import { DataCard, createStudentAttendanceCard, createStudentClassUpdateCard } from "@/src/features/cards/logic/cardDataCreator";
import Card from "@/src/features/cards/ui/Card";
import { useParentLoginContext } from "@/src/features/context/ParentLoginContext";
import { Student, Teacher_parentSide } from "@/src/features/fetch-user-data/api/parent_data_fetcher";
import { DayOfWeek, fetchSchedulesByClass } from "@/src/features/schedules/api/scheduleRepo";
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
  // get unique class ids from enrollments for fetching announcements
  const classIds = [...new Set(userEnrollments.map((e) => e.classId))];
  const { announcements, isLoading: announcementsLoading } = useParentAnnouncements(classIds);

  const tint = useThemeColor({}, "tint");
  const cardBg = useThemeColor({}, "cardBackground");
  const textColor = useThemeColor({}, "text");
  const subtextColor = useThemeColor({}, "placeholderText");
  const borderColor = useThemeColor({}, "listBorderTranslucent");

  // figure out how long ago an announcement was posted
  const getTimeAgo = (dateStr: string): string => {
    const now = new Date();
    const date = new Date(dateStr);
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  // find the class name for an announcement
  const getClassName = (classId?: string | null): string => {
    if (!classId) return "";
    const cls = userClasses.find((c) => c.id === classId);
    return cls?.name ?? "";
  };

  // converts 24hr time from aws (like "14:30:00") to readable format (like "2:30 PM")
  const formatTime = (awsTime: string): string => {
    const [h, m] = awsTime.split(":");
    const hour = parseInt(h, 10);
    const ampm = hour >= 12 ? "PM" : "AM";
    const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    return `${displayHour}:${m} ${ampm}`;
  };

  // get current day of week in the format AWS uses
  const getTodayDayOfWeek = (): DayOfWeek => {
    const days: DayOfWeek[] = ["SUNDAY", "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY"];
    return days[new Date().getDay()];
  };

  const firstLoad = useCallback(async () => {
    let cardset: DataCard[] = []

    // go through each student and generate relevant cards for them
    for(const stu of userStudents) {
      const firstEnrollment = userEnrollments.find(enrollment => enrollment.studentId === stu.id)
      const firstClass = userClasses.find(theclass => theclass.id === firstEnrollment?.classId)
      let tempTeach: Teacher_parentSide
      if(firstClass) {
        const temptemp = userTeachers.find(teach => teach.id === firstClass.teacherId);
        tempTeach = temptemp ?? {id: "error", name: "error", schoolId: "error"};
      } else {
        tempTeach = {id: "error", name: "error", schoolId: "error"};
      }

      // fetch schedule for this class to get the end time
      let endTime: string | undefined;
      if(firstClass) {
        try {
          const schedResult = await fetchSchedulesByClass(firstClass.id);
          if(schedResult.data) {
            const todaySchedule = schedResult.data.find(s => s.dayOfWeek === getTodayDayOfWeek());
            if(todaySchedule) {
              endTime = formatTime(todaySchedule.endTime);
            }
          }
        } catch { /* schedule fetch is best-effort */ }
      }

      if(firstEnrollment && firstClass) {
        const classCard = createStudentClassUpdateCard(stu, firstClass, firstEnrollment, tempTeach, endTime)
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
      <ScrollView contentContainerStyle={containerStyle.scrollContent} showsVerticalScrollIndicator={false} scrollEnabled={false}>

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
        <Text style={[containerStyle.sectionLabel, { color: subtextColor }]}>
          ANNOUNCEMENTS
        </Text>
        {announcements.length > 0 && (
        <View style={containerStyle.miniScrollContainer}>
          <ScrollView showsVerticalScrollIndicator={false} horizontal={false} contentContainerStyle={containerStyle.miniScrollContent}>
            {announcements.slice(0, 5).map((ann) => (
              <Card 
                key={ann.id}
                header={ann.title}
                preview={`${(getClassName(ann.classId))} ${getClassName(ann.classId) ? "· " : ""}${getTimeAgo(ann.createdAt)}\n${ann.body}`}
                onPress={() => {/* todo: route to announcement-relevant page */}}
                icon={{name: "megaphone", size: 18, color: "#8b5cf6", backgroundColor: "#8b5cf620"}}
              />
            ))}
          </ScrollView>
        </View>
      )}
      {announcementsLoading && (
        <View style={{ paddingVertical: 12, alignItems: "center" }}>
          <ActivityIndicator size="small" color={tint} />
        </View>
      )}


        {/* Relevant Teacher Updates or Notes Section */}
        <View>
          <Text style={[containerStyle.sectionLabel, {color: subtextcolor}]}>TEACHER NOTES</Text>
          <Text style={{color: textcolor}}>tbd!</Text>
        </View>

      </ScrollView>
    </View>
  );
}
