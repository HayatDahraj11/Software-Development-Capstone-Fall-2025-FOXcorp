import { useRouter } from "expo-router";
import { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import { Colors } from "@/src/features/app-themes/constants/theme";
import { debug_parent } from "@/src/features/auth/logic/debug_parent_data";
import Card from "@/src/features/cards/ui/Card";
import Parent_ChildPicker from "@/src/features/child-selection/ui/Parent_ChildPicker";
import { MaterialIcons } from "@expo/vector-icons";

export default function ParentGeneralInfoScreen() {
  const router = useRouter();

  const RouteCard = (route: string): void => {
      // if card has a route, use it. if not, ignore it
      if(route === "studentSchedule") { 
        router.push({ 
          pathname: '/(parent)/(tabs)/[studentId]/studentSchedule',
          params: {studentId: (childSelected.studentId)},
        });
      } else if(route === "studentRecords") {
        router.push({ 
          pathname: '/(parent)/(tabs)/[studentId]/studentRecords',
          params: {studentId: (childSelected.studentId)},
        });
      } else if(route === "studentDocumentation") {
        router.push({ 
          pathname: '/(parent)/(tabs)/[studentId]/studentDocumentation',
          params: {studentId: (childSelected.studentId)},
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
  const [childSelected, setChildSelected] = useState(debug_parent.guardianUser.children[0]);

  // modal controller states
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);

  const onChildSelected = (id: string) => {
    let foundKid = debug_parent.guardianUser.children.find(item => item.studentId === id);
    if(foundKid) {
      foundKid = {
        studentId: foundKid?.studentId,
        firstName: foundKid?.firstName,
        lastName: foundKid?.lastName,
        dob: foundKid?.dob,
        classes: foundKid?.classes,
        attendanceRate: foundKid?.attendanceRate
      }
      setChildSelected(foundKid);
    } else {
      console.log("Somehow, a kid was selected that didn't exist. onChildSelected()")
    }

  };

  // when linking to the doc pages, access the [studentId] folder using param: {studentId: childSelected.studentId}
  // you can also pass the student object as a param, { student = childSelected }
  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Pressable style={styles.dropdownContainer} onPress={() => setIsModalVisible(true)}>
          <MaterialIcons name={"keyboard-arrow-down"} size={22} color={Colors.light.icon}/>
          <Text style={styles.dropdownLabel}>{childSelected.firstName}</Text>
        </Pressable>
      </View>
      <ScrollView>
        <Card
          header="Schedule"
          preview={scheduleListCreation(childSelected.classes)}
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
        studentNames={debug_parent.guardianUser.children.map((item) => item.firstName)}
        studentIds={debug_parent.guardianUser.children.map((item) => item.studentId)}
        onSelect={onChildSelected}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
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
      backgroundColor: '#d4d4d4ff',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 10,
      marginHorizontal: 20,
      shadowColor: Colors.light.tabIconDefault,
  },
  dropdownLabel: {
      color: Colors.light.text,
      fontSize: 14,
      fontWeight: '600',
  },
});