import { Href, useRouter } from "expo-router";
import { Colors } from "@/constants/theme";
import { Pressable, StyleSheet, Text, View } from "react-native";

export default function ClassHome() {
const router = useRouter();
  return (
    <View style={[
        styles.container,
        {
          // Try setting `flexDirection` to `"row"`.
          flexDirection: 'row',
          flexWrap: 'wrap',
          justifyContent: "center",
        },
      ]}>
      <Pressable style={[styles.grid, ]} onPress={() => router.push("/messaging")}> 
        <Text style={[styles.gridText]}>Messaging</Text>
      </Pressable>
      <Pressable  style={[styles.grid, ]} onPress={() => router.push("/announcements")}>
        <Text style={[styles.gridText]}>Announcements</Text>
      </Pressable>
      <Pressable  style={[styles.grid, ]} onPress={() => router.push("/attendance-list")}>
        <Text style={[styles.gridText]}>Roster</Text>
      </Pressable>
      <Pressable  style={[styles.grid, ]} onPress={() => router.push("/attendance-map")}>
        <Text style={[styles.gridText]}>Map</Text>
      </Pressable>
      <Pressable  style={[styles.grid, ]} onPress={() => router.push("/grades")}>
        <Text style={[styles.gridText]}>Grades</Text>
      </Pressable>
      <View  style={[styles.grid, ]}>
        <Text style={[styles.gridText]}>etc.</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background
  },
  grid: {
    backgroundColor: "transparent",
    borderWidth: 2,
    borderColor: "black",
    flexDirection: "row",
    width: '40%',
    height: 120,
    margin: 10,
    flexWrap: "wrap",
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
  },
  gridText: {
    fontSize: 18,
    fontWeight: "600",
    color: "black",
    textAlign: "center",
    flexShrink: 1,
    textAlignVertical: "center",
  },
  
});