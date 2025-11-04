import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";

export default function Modal() {
  return (
    <Pressable style={styles.overlay} onPress={() => router.back()}>
      <Pressable style={styles.card} onPress={(e) => e.stopPropagation()}>
        <View style={styles.headerRow}>
          <Text style={styles.nameText}>Student Name</Text>

          <View style={styles.parentRow}>
            <Text style={styles.parentText}>Parent Name</Text>
            <Pressable onPress={() => router.push("/messaging")}>
              <Ionicons name="mail-outline" size={22} color="black" />
            </Pressable>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Medical/Record info</Text>
          <Text>Medical Records Stuff</Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notes</Text>
          <TextInput
            style={styles.textInput}
            placeholder="Teacher notes"
            multiline
          />
        </View>
      </Pressable>
    </Pressable>

  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)", // translucent background
    justifyContent: "flex-end",
    alignItems: "center",
  },
  card: {
    width: "90%",
    backgroundColor: "white",
    borderRadius: 20,
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  nameText: {
    fontSize: 18,
    fontWeight: "600",
  },
  parentRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  parentText: {
    fontSize: 16,
    marginRight: 4,
  },
  section: {
    marginTop: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 4,
  },
  divider: {
    borderBottomWidth: 1,
    borderStyle: "dashed",
    borderColor: "#999",
    marginVertical: 12,
  },
  textInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 8,
    minHeight: 80,
    textAlignVertical: "top",
  },
});