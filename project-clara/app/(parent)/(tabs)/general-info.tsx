import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";

// children dictionaries, which store key: value information about each child of the parent who is logged on
// intended to be provided by database later, hardcoded for now
const firstChildInfoDictionary = {
    name: "Darcey",
    classes: ["English", "Maths", "Mario"],
}
const secondChildInfoDictionary = {
  name: "Daan",
  classes: ["History", "Maths"],
}

// user info dictionary, or, all info about the parent that should be readily accessible
// childern key holds array of dictionaries for each child
const userInfoDictionary = {
  children: [firstChildInfoDictionary, secondChildInfoDictionary]
}

export default function ParentGeneralInfoScreen() {

  // this holds which child of the parent's is currently being displayed
  const [childSelected, setChildSelected] = useState(userInfoDictionary.children[0]);

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