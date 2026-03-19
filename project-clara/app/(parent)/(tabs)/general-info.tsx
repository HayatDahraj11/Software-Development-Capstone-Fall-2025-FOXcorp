import { useRouter } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { Platform, Pressable, ScrollView, Text, View } from "react-native";

import { containerStyle, dialogStyle, dropdownStyle, quickActionStyle } from "@/src/features/app-themes/constants/stylesheets";
import { useThemeColor } from "@/src/features/app-themes/logic/use-theme-color";
import Card from "@/src/features/cards/ui/Card";
import { useParentLoginContext } from "@/src/features/context/ParentLoginContext";
import { Student } from "@/src/features/fetch-user-data/api/parent_data_fetcher";

import Parent_ViewClassComponent from "@/src/features/class-viewer/ui/Parent_ViewClassComponent";
import {
  Dialog,
  DialogContent
} from '@/src/rnreusables/ui/dialog';
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
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import type { TriggerRef } from '@rn-primitives/select';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function ParentGeneralInfoScreen() {
  const router = useRouter();

  // colors grabbed by app theme
  const bgcolor = useThemeColor({}, "background");
  const cardbgcolor = useThemeColor({}, "cardBackground");
  const tabiconcolor = useThemeColor({}, "tabIconDefault");
  const textcolor = useThemeColor({}, "text");
  const tintcolor = useThemeColor({}, 'tint');
  const listtextcolor = useThemeColor({}, "listText");
  const subtextcolor = useThemeColor({}, "placeholderText");
  const modalbgcolor = useThemeColor({}, "modalBackground")

  const {
        userParent,
        userStudents,
        userClasses,
        userEnrollments,
        getClassesMappedByStudent,
        getTeacherNamebyId,
        getStudentGradeInClass,
  } = useParentLoginContext();

  const RouteCard = (route: string): void => {
      // if card has a route, use it. if not, ignore it
      if(route === "studentSchedule") { 
        router.push({ 
          pathname: '/(parent)/(tabs)/[studentId]/studentSchedule',
          params: {studentId: (childSelected.id)},
        });
      } else if(route === "studentRecords") {
        router.push({ 
          pathname: '/(parent)/(tabs)/[studentId]/studentRecords',
          params: {studentId: (childSelected.id)},
        });
      } else if(route === "studentDocumentation") {
        router.push({ 
          pathname: '/(parent)/(tabs)/[studentId]/studentDocumentation',
          params: {studentId: (childSelected.id)},
        });
      }
      else { }
  };

  // this holds which child of the parent's is currently being displayed
  const [childSelected, setChildSelected] = useState<Student>(userStudents[0]);
  const [childIdSelected, setChildIdSelected] = useState<Option>({value: userStudents[0].id, label: userStudents[0].firstName})
  const [childClasses, setChildClasses] = useState<{classId: string; className: string; teacherId: string; teacherName: string; grade: number}[]>()
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [classOpened, setClassOpened] = useState<{classId: string; className: string; teacherId: string; teacherName: string; grade: number}>();

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
      
    } else {
      console.warn("Somehow, a kid was selected that didn't exist. onChildSelected()")
    }

  }, [getClassesMappedByStudent, getStudentGradeInClass, getTeacherNamebyId, userClasses, userStudents]);
  useEffect(() => { // this will update child selected when a new child is selected...
    if(childIdSelected) {
      onChildSelected(childIdSelected?.value);
    }
  }, [childIdSelected, onChildSelected])

  // when one of the classes is tapped, open the dialogue with info about it
  const onClassClicked = (classArrayIndex: number) => {
    if(childClasses) {
      setClassOpened(childClasses[classArrayIndex]);
      setIsDialogOpen(true);
    } else {
      console.warn("Tried to open a class that wasn't found.")
    }
  }

  // when linking to the doc pages, access the [studentId] folder using param: {studentId: childSelected.studentId}
  // you can also pass the student object as a param, { student = childSelected }
  return (
    <View style={[containerStyle.container, {backgroundColor: bgcolor}]}>
      <ScrollView contentContainerStyle={containerStyle.scrollContent} showsVerticalScrollIndicator={false}>
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
        <View>
          <View>
            <Text style={[containerStyle.sectionLabel, {color: subtextcolor}]}>
              {childSelected ? `${childSelected.firstName}'s CLASSES` : "CLASS SCHEDULE"}
            </Text>
            
            {childClasses?.length === 0 ? (
              <View style={containerStyle.empty}>
                <Text style={{color: subtextcolor, fontSize: 16}}>No classes found</Text>
              </View>
            ) : (
              childClasses?.map((row, index) => {
                const gradeDisplay = row.grade != null ? Math.round(row.grade) : null;
                return (
                  <Card 
                    key={row.classId}
                    header={row.className}
                    preview={row.teacherName}
                    onPress={()=>{onClassClicked(index)}}
                    urgent={true}
                    pressable={true}
                    icon={{name: "book", size: 22, color: tintcolor, backgroundColor: (tintcolor+20)}}
                    badge={
                      gradeDisplay !== null ? (
                        {type: 0, content: `${gradeDisplay}%`, contentColor: gradeDisplay >= 90 ? "#16a34a" : gradeDisplay >= 70 ? "#d97706" : "#dc2626", backgroundColor: gradeDisplay >= 90 ? "#22c55e20" : gradeDisplay >= 70 ? "#f59e0b20" : "#ef444420"}
                      ) : (undefined)
                    }
                  />
                )
              })
            )}
          </View>
          <View>
            <Text style={[containerStyle.sectionLabel, {color: subtextcolor}]}>
              {childSelected ? `${childSelected.firstName}'s RECORDS` : "STUDENT RECORDS"}              
            </Text>
            <View style={quickActionStyle.quickActionsContainer}>
              <Pressable
                style={[quickActionStyle.quickActionBtn, {backgroundColor: cardbgcolor}]}
                onPress={() => RouteCard("studentRecords")}
              >
                <MaterialIcons name="class" size={22} color={tintcolor} />
                <Text style={[quickActionStyle.quickActionLabel, {color: textcolor}]}>Class Records</Text>
                <Text style={[quickActionStyle.quickActionSublabel, {color: subtextcolor}]}>Grades, Attendance, etc.</Text>
              </Pressable>
              <Pressable
                style={[quickActionStyle.quickActionBtn, {backgroundColor: cardbgcolor}]}
                onPress={() => RouteCard("studentDocumentation")}
              >
                <Ionicons name="document-text-outline" size={22} color={tintcolor} />
                <Text style={[quickActionStyle.quickActionLabel, {color: textcolor}]}>Documentation</Text>
                <Text style={[quickActionStyle.quickActionSublabel, {color: subtextcolor}]}>Medical, Notes, etc.</Text>
              </Pressable>
            </View>

            <Dialog 
                  open={isDialogOpen}
                  onOpenChange={() => {
                      if(isDialogOpen) {
                          setIsDialogOpen(false);
                      } else {setIsDialogOpen(true)}
                  }}
              >
                  <DialogContent 
                      style={[dialogStyle.dialogueContainer, {backgroundColor: modalbgcolor}]}
                  >
                      <Parent_ViewClassComponent 
                        classId={classOpened ? classOpened.classId : "broken"}
                        className={classOpened ? classOpened.className : "broken"}
                        teacherId={classOpened ? classOpened.teacherId : "broken"}
                        teacherName={classOpened ? classOpened.teacherName : "broken"}
                        studentGrade={classOpened ? classOpened.grade : -1}
                        onClickProfilePic={() => {console.log("not built yet"); setIsDialogOpen(false);}}
                      />
                  </DialogContent>
              </Dialog>
          </View>
        </View> 
      </ScrollView>
    </View>
  );
}
