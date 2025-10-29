import { useState } from "react";
import { StyleSheet, Text, View, ScrollView } from "react-native";
import { useRouter, Href } from "expo-router";

import Card from "@/components/Card";

// children dictionaries, which store key: value information about each child of the parent who is logged on
// intended to be provided by database later, hardcoded for now
// in the relational database, the student's information will be within their own objects, and the user's information will point to the students they have access to
const firstChildInfoDictionary = {
  studentId: "123",
  firstName: "Darcey",
  lastName: "Incredible",
  dob: "temp",
  classes: ["English", "Maths", "Mario"],
  attendanceRate: 100,
}
const secondChildInfoDictionary = {
  studentId: "124",
  firstName: "Daan",
  lastName: "Incredible",
  dob: "temp",
  classes: ["History", "Maths"],
  attendanceRate: 89,
}

// user info dictionary, or, all info about the parent that should be readily accessible
// childern key holds array of dictionaries for each child
const guardianUser = {
  userId: "12",
  guardianId: "12",
  canEditRecords: true,
  children: [firstChildInfoDictionary, secondChildInfoDictionary],
  updateStudentInfo : function(studentId: string) {
    console.log("updateStudentInfo called but this function is not made yet! sorry!")
  }
}

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
  const [childSelected, setChildSelected] = useState(guardianUser.children[0]);

  // when linking to the doc pages, access the [studentId] folder using param: {studentId: childSelected.studentId}
  // you can also pass the student object as a param, { student = childSelected }
  return (
    <View style={styles.container}>
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});