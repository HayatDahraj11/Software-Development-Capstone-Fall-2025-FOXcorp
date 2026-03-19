import { useRouter } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { Platform, ScrollView, View } from "react-native";

import { containerStyle, dropdownStyle } from "@/src/features/app-themes/constants/stylesheets";
import { useThemeColor } from "@/src/features/app-themes/logic/use-theme-color";
import Card from "@/src/features/cards/ui/Card";
import { useParentLoginContext } from "@/src/features/context/ParentLoginContext";
import { Student } from "@/src/features/fetch-user-data/api/parent_data_fetcher";

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

export default function ParentGeneralInfoScreen() {
  const router = useRouter();

  // colors grabbed by app theme
  const bgcolor = useThemeColor({}, "background");
  const cardbgcolor = useThemeColor({}, "cardBackground");
  const tabiconcolor = useThemeColor({}, "tabIconDefault");
  const textcolor = useThemeColor({}, "text")
  const tintcolor = useThemeColor({}, 'tint')
  const listtextcolor = useThemeColor({}, "listText")

  const {
        userParent,
        userStudents,
        userClasses,
        userEnrollments,
        getClassesMappedByStudent,
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

  const scheduleListCreation = (classIds: string[]): string => {
    let superstring = ``
    for (let i = 0; i<classIds.length; i++) {
      const tempName: string = userClasses.find(cla => cla.id === classIds[i])?.name ?? "error! undef"
      superstring = superstring + (i+1) + `) ` + tempName;
      if(i<(classIds.length-1)) {
        superstring = superstring + '\n'
      }
    }
    return superstring;
  }

  // this holds which child of the parent's is currently being displayed
  const [childSelected, setChildSelected] = useState<Student>(userStudents[0]);
  const [childIdSelected, setChildIdSelected] = useState<Option>({value: userStudents[0].id, label: userStudents[0].firstName})

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

  // modal controller states
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);

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
    } else {
      console.warn("Somehow, a kid was selected that didn't exist. onChildSelected()")
    }

  }, [userStudents]);
  useEffect(() => {
    if(childIdSelected) {
      onChildSelected(childIdSelected?.value);
    }
  }, [childIdSelected, onChildSelected])

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
          <Card
            header="Schedule"
            preview={scheduleListCreation(getClassesMappedByStudent(childSelected.id))}
            onPress={() => RouteCard("studentSchedule")}
          />
          <Card
            header="Records"
            preview={`Your child has ${childSelected.attendanceRate}% attendance and is up to date with all medical records`} // bug, this says undefined?
            onPress={() => RouteCard("studentRecords")}
          />
          <Card
            header="Documentation"
            preview={"Emergency contacts, behavioral records, teacher notes, and other related details found here"}
            onPress={() => RouteCard("studentDocumentation")}
          />
        </View> 
      </ScrollView>
    </View>
  );
}
