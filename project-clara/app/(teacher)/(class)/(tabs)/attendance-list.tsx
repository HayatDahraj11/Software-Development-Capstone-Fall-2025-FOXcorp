import { Href, useRouter } from "expo-router";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { useThemeColor } from "@/src/features/app-themes/logic/use-theme-color";
import { useGlobalSearchParams } from "expo-router";
import { useTeacherLoginContext } from "@/src/features/context/TeacherLoginContext";

// pull out the initials from a first and last name
function getInitials(first: string, last: string) {
  return `${first.charAt(0)}${last.charAt(0)}`.toUpperCase();
}

// pick a color based on the student name so each avatar is consistent
const AVATAR_COLORS = [
  "#6366f1", "#f59e0b", "#10b981", "#ef4444",
  "#8b5cf6", "#ec4899", "#14b8a6", "#f97316",
];

function pickAvatarColor(name: string) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

export default function AttendanceList() {
  const router = useRouter();
  const { classId } = useGlobalSearchParams();
  const { userClasses } = useTeacherLoginContext();

  const bg = useThemeColor({}, "background");
  const cardBg = useThemeColor({}, "cardBackground");
  const textColor = useThemeColor({}, "text");
  const subtextColor = useThemeColor({}, "placeholderText");
  const tint = useThemeColor({}, "tint");

  const classIdString = Array.isArray(classId) ? classId[0] : classId;
  const selectedClass = userClasses.find((cls) => cls.id === classIdString);
  const enrollments = selectedClass?.enrollments ?? [];

  const students = enrollments
    .map((enrollment) => enrollment?.student)
    .filter((s): s is NonNullable<typeof s> => Boolean(s));

  return (
    <View style={[styles.container, { backgroundColor: bg }]}>
      <FlatList
        data={students}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={[styles.title, { color: textColor }]}>Student Roster</Text>
            <View style={[styles.countBadge, { backgroundColor: tint + "18" }]}>
              <Text style={[styles.countText, { color: tint }]}>
                {students.length} {students.length === 1 ? "Student" : "Students"}
              </Text>
            </View>
          </View>
        }
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons name="people-outline" size={48} color={subtextColor} />
            <Text style={[styles.emptyText, { color: subtextColor }]}>
              No students enrolled yet
            </Text>
          </View>
        }
        renderItem={({ item }) => {
          const initials = getInitials(item.firstName ?? "", item.lastName ?? "");
          const fullName = `${item.firstName} ${item.lastName}`;
          const avatarColor = pickAvatarColor(fullName);
          const gradeLevel = (item as any).gradeLevel;
          const attendanceRate = (item as any).attendanceRate;

          return (
            <Pressable
              style={({ pressed }) => [
                styles.card,
                { backgroundColor: cardBg, opacity: pressed ? 0.85 : 1 },
              ]}
              onPress={() =>
                router.push(
                  `/(teacher)/(class)/modal?studentId=${item.id}` as Href
                )
              }
            >
              <View style={styles.cardRow}>
                {/* colored initials avatar */}
                <View style={[styles.avatar, { backgroundColor: avatarColor + "20" }]}>
                  <Text style={[styles.avatarText, { color: avatarColor }]}>
                    {initials}
                  </Text>
                </View>

                {/* name and grade level */}
                <View style={styles.cardContent}>
                  <Text style={[styles.studentName, { color: textColor }]}>
                    {fullName}
                  </Text>
                  {gradeLevel != null && (
                    <Text style={[styles.gradeLevel, { color: subtextColor }]}>
                      Grade {gradeLevel}
                    </Text>
                  )}
                </View>

                {/* attendance rate badge if available */}
                {attendanceRate != null && (
                  <View
                    style={[
                      styles.rateBadge,
                      {
                        backgroundColor:
                          attendanceRate >= 90
                            ? "#22c55e20"
                            : attendanceRate >= 75
                            ? "#f59e0b20"
                            : "#ef444420",
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.rateText,
                        {
                          color:
                            attendanceRate >= 90
                              ? "#16a34a"
                              : attendanceRate >= 75
                              ? "#d97706"
                              : "#dc2626",
                        },
                      ]}
                    >
                      {Math.round(attendanceRate)}%
                    </Text>
                  </View>
                )}

                <Ionicons name="chevron-forward" size={18} color={subtextColor} />
              </View>
            </Pressable>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  listContent: { padding: 20, paddingBottom: 40 },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 8,
  },
  countBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 16,
  },
  countText: {
    fontSize: 13,
    fontWeight: "600",
  },
  empty: {
    alignItems: "center",
    paddingTop: 60,
    gap: 12,
  },
  emptyText: {
    fontSize: 16,
  },
  card: {
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  cardRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
  avatar: {
    width: 46,
    height: 46,
    borderRadius: 23,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    fontSize: 17,
    fontWeight: "700",
  },
  cardContent: {
    flex: 1,
  },
  studentName: {
    fontSize: 16,
    fontWeight: "600",
  },
  gradeLevel: {
    fontSize: 13,
    marginTop: 2,
  },
  rateBadge: {
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 8,
  },
  rateText: {
    fontSize: 12,
    fontWeight: "700",
  },
});
