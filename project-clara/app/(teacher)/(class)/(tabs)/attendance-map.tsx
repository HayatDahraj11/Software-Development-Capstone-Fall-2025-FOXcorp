import { Colors } from "@/src/features/app-themes/logic/theme";
import { StyleSheet, Text, View } from "react-native";

export default function attendanceMap() {

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