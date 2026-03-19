import { useThemeColor } from "@/src/features/app-themes/logic/use-theme-color";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Pressable, StyleSheet, Text, View, ScrollView } from "react-native";
import { Href } from "expo-router";
import { useTeacherLoginContext } from "@/src/features/context/TeacherLoginContext";
import { useLocalSearchParams } from "expo-router";
import { usePushNotifications } from "@/src/features/notifications/logic/usePushNotifications";

// grid items for the class home screen, each with a route, label, and icon
const GRID_ITEMS: {
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  route: string;
}[] = [
  { label: "Messaging", icon: "chatbubble", route: "/messaging" },
  { label: "Announcements", icon: "megaphone", route: "/announcements" },
  { label: "Roster", icon: "people", route: "/attendance-list" },
  { label: "Dashboard", icon: "stats-chart", route: "/attendance-map" },
  { label: "Grades", icon: "ribbon", route: "/grades" },
  { label: "Take Attendance", icon: "checkbox", route: "/take-attendance" },
  { label: "Incidents", icon: "warning", route: "/incidents" },
];

export default function ClassHome() {
  const router = useRouter();
  const { classId } = useLocalSearchParams();

  const { userTeacher, userClasses } = useTeacherLoginContext();

  usePushNotifications(userTeacher.userId, "TEACHER");

  const bg = useThemeColor({}, "background");
  const cardBg = useThemeColor({}, "cardBackground");
  const textColor = useThemeColor({}, "text");
  const subtextColor = useThemeColor({}, "placeholderText");
  const tint = useThemeColor({}, "tint");

  // find the current class so we can show the name and student count
  const classIdString = Array.isArray(classId) ? classId[0] : classId;
  const selectedClass = userClasses.find((cls) => cls.id === classIdString);
  const studentCount = selectedClass?.enrollments?.length ?? 0;

  return (
    <ScrollView style={[styles.container, { backgroundColor: bg }]} contentContainerStyle={styles.scrollContent}>
      {/* header with class name and student count */}
      <View style={styles.header}>
        <Text style={[styles.className, { color: textColor }]}>
          {selectedClass?.name ?? "Class"}
        </Text>
        <View style={[styles.countBadge, { backgroundColor: tint + "18" }]}>
          <Ionicons name="people" size={16} color={tint} />
          <Text style={[styles.countText, { color: tint }]}>
            {studentCount} {studentCount === 1 ? "Student" : "Students"}
          </Text>
        </View>
      </View>

      {/* grid of action cards */}
      <View style={styles.grid}>
        {GRID_ITEMS.map((item) => (
          <Pressable
            key={item.label}
            style={({ pressed }) => [
              styles.card,
              { backgroundColor: cardBg, opacity: pressed ? 0.85 : 1 },
            ]}
            onPress={() =>
              router.push({
                pathname: item.route,
                params: { classId },
              } as unknown as Href)
            }
          >
            <View style={[styles.iconCircle, { backgroundColor: tint + "15" }]}>
              <Ionicons name={item.icon} size={28} color={tint} />
            </View>
            <Text style={[styles.cardLabel, { color: textColor }]}>{item.label}</Text>
          </Pressable>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 24,
  },
  className: {
    fontSize: 26,
    fontWeight: "700",
    marginBottom: 8,
  },
  countBadge: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
  },
  countText: {
    fontSize: 14,
    fontWeight: "600",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 14,
  },
  card: {
    width: "47%",
    borderRadius: 16,
    paddingVertical: 24,
    paddingHorizontal: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 6,
    elevation: 3,
  },
  iconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  cardLabel: {
    fontSize: 15,
    fontWeight: "600",
    textAlign: "center",
  },
});
