import { useRouter } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { Platform, ScrollView, StyleSheet, View } from "react-native";

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


  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: useThemeColor({}, "background"),
    },
    headerContainer: {
      flex: 1/10,
      alignContent: 'flex-start',
      justifyContent: 'center',
      flexDirection: 'column',
    },
    dropdownContainer: {
      flexDirection: 'row',
      width: '20%',
      height: '80%',
      backgroundColor: useThemeColor({}, "cardBackground"),
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 10,
      marginHorizontal: 20,
      shadowColor: useThemeColor({}, "tabIconDefault"),
    },
    dropdownLabel: {
      color: useThemeColor({}, "text"),
      fontSize: 14,
      fontWeight: '600',
    },
  });

  // when linking to the doc pages, access the [studentId] folder using param: {studentId: childSelected.studentId}
  // you can also pass the student object as a param, { student = childSelected }
  return (
    <View style={[styles.container, {backgroundColor: bgcolor}]}>
      <View style={styles.headerContainer}>
        {/* 
        <Pressable style={styles.dropdownContainer} onPress={() => setIsModalVisible(true)}>
          <MaterialIcons name={"keyboard-arrow-down"} size={22} color={useThemeColor({}, "icon")}/>
          <Text style={styles.dropdownLabel}>{childSelected.firstName}</Text>
        </Pressable> */}
        <Select value={childIdSelected} onValueChange={setChildIdSelected}>
          <SelectTrigger ref={ref} style={{backgroundColor: cardbgcolor}} onTouchStart={Platform.select({web: onTouchStart})}>
            <SelectValue style={[styles.dropdownLabel, {color: textcolor}]} placeholder={childSelected.firstName} />
          </SelectTrigger>
          <SelectContent insets={contentInsets} >
            <SelectGroup>
              <SelectLabel>Select a Student</SelectLabel>
              {userStudents.map((stu) => (
                <SelectItem key={stu.id} label={stu.firstName} value={stu.id}>
                  {stu.firstName}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </View>
      <ScrollView>
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
      </ScrollView>
    </View>
  );
}
