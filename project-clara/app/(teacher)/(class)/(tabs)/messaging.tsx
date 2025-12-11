import { Colors } from "@/constants/theme";
import { StyleSheet, Text, View } from "react-native";

export default function TeacherMessagingScreen() {

  return (
    <View style={styles.container}>
      <Text>This is a placeholder!</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background
  },
});