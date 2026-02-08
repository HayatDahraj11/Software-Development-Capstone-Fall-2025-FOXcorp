import { useRouter } from "expo-router";
import { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import { useThemeColor } from "@/src/features/app-themes/logic/use-theme-color";
import Card from "@/src/features/cards/ui/Card";
import Parent_ChildPicker from "@/src/features/child-selection/ui/Parent_ChildPicker";
import { useParentLoginContext } from "@/src/features/context/ParentLoginContext";
import { Student } from "@/src/features/fetch-user-data/api/parent_data_fetcher";
import { MaterialIcons } from "@expo/vector-icons";

// until we get classes to students link setup, this is the hardcoded data
const HardcodedClasses = [
  "English",
  "French",
  "Nintendo games",
]

export default function ParentGeneralInfoScreen() {
  const router = useRouter();

  const {
        userParent,
        userStudents,
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

  const scheduleListCreation = (classes: string[]): string => {
    let superstring = ``
    for (let i = 0; i<classes.length; i++) {
      superstring = superstring + (i+1) + `) ` + classes.at(i);
      if(i<(classes.length-1)) {
        superstring = superstring + '\n'
      }
    }
    return superstring;
  }

  // this holds which child of the parent's is currently being displayed
  const [childSelected, setChildSelected] = useState<Student>(userStudents[0]);

  // modal controller states
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);

  const onChildSelected = (id: string) => {
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
      console.log("Somehow, a kid was selected that didn't exist. onChildSelected()")
    }

  };


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
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Pressable style={styles.dropdownContainer} onPress={() => setIsModalVisible(true)}>
          <MaterialIcons name={"keyboard-arrow-down"} size={22} color={useThemeColor({}, "icon")}/>
          <Text style={styles.dropdownLabel}>{childSelected.firstName}</Text>
        </Pressable>
      </View>
      <ScrollView>
        <Card
          header="Schedule"
          preview={scheduleListCreation(HardcodedClasses)}
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

      <Parent_ChildPicker 
        isVisible={isModalVisible}
        onCloseModal={() => setIsModalVisible(false)}
        studentNames={userStudents.map((item) => item.firstName)}
        studentIds={userStudents.map((item) => item.id)}
        onSelect={onChildSelected}
      />
    </View>
  );
}
