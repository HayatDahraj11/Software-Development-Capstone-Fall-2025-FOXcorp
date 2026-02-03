import { useThemeColor } from "@/src/features/app-themes/logic/use-theme-color";
import { StyleSheet, Text, View } from "react-native";

export default function attendanceMap() {

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: useThemeColor({}, "background")
  },
});

  return (
    <View style={styles.container}>
      <Text>This is a placeholder!</Text>
    </View>
  );
}

