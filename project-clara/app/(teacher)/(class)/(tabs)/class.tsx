import { Href, useRouter } from "expo-router";
import { Colors } from "@/constants/theme";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function ClassHome() {
const router = useRouter();
  return (
    <View style={[
        styles.container,
        {
          flexDirection: 'row',
          flexWrap: 'wrap',
          justifyContent: "center",
        },
      ]}>
      <Pressable style={[styles.grid, ]} onPress={() => router.push("/messaging")}> 
        <Text style={[styles.gridText]}>Messaging</Text>
        <Ionicons name="chatbubble-ellipses-outline" size={32} color="black" />
      </Pressable>
      <Pressable  style={[styles.grid, ]} onPress={() => router.push("/announcements")}>
        <Text style={[styles.gridText]}>Announcements</Text>
        <Ionicons name="megaphone-outline" size={32} color="black" />
      </Pressable>
      <Pressable  style={[styles.grid, ]} onPress={() => router.push("/attendance-list")}>
        <Text style={[styles.gridText]}>Roster</Text>
        <Ionicons name="map-outline" size={32} color="black" />
      </Pressable>
      <Pressable  style={[styles.grid, ]} onPress={() => router.push("/attendance-map")}>
        <Text style={[styles.gridText]}>Map</Text>
        <Ionicons name="map-outline" size={32} color="black" />
      </Pressable>
      <Pressable  style={[styles.grid, ]} onPress={() => router.push("/grades")}>
        <Text style={[styles.gridText]}>Grades</Text>
        <Ionicons name="ellipsis-horizontal-outline" size={32} color="black" />
      </Pressable>
      <View  style={[styles.grid, ]}>
        <Text style={[styles.gridText]}>etc.</Text>
        <Ionicons name="ellipsis-horizontal-outline" size={32} color="black" />
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
    flexDirection: "column",
    width: '40%',
    height: 120,
    margin: 10,
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
    
  },
  
});