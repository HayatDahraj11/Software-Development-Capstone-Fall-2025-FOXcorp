import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";

// children dictionaries, which store key: value information about each child of the parent who is logged on
// intended to be provided by database later, hardcoded for now
// in the relational database, the student's information will be within their own objects, and the user's information will point to the students they have access to
const firstChildInfoDictionary = {
  studentId: "123",
  firstName: "Darcey",
  lastName: "Incredible",
  dob: "temp",
  classes: ["English", "Maths", "Mario"],
}
const secondChildInfoDictionary = {
  studentId: "124",
  firstName: "Daan",
  lastName: "Incredible",
  dob: "temp",
  classes: ["History", "Maths"],
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

  // this holds which child of the parent's is currently being displayed
  const [childSelected, setChildSelected] = useState(guardianUser.children[0]);

  return (
    <View style={styles.container}>
      <Text>This is a placeholder!</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});