// parent view of their kids classes and when they meet
// pulls class info from context (already loaded on login) and fetches
// the actual schedule times from the Schedule table in dynamodb
// if a class has no schedule entries it just shows the card without times
import { useLocalSearchParams } from "expo-router";
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { useThemeColor } from "@/src/features/app-themes/logic/use-theme-color";
import { useParentLoginContext } from "@/src/features/context/ParentLoginContext";
import { useSchedules } from "@/src/features/schedules/logic/useSchedules";
import { DayOfWeek } from "@/src/features/schedules/api/scheduleRepo";

// for sorting days monday first
const DAY_ORDER: DayOfWeek[] = [
  "MONDAY",
  "TUESDAY",
  "WEDNESDAY",
  "THURSDAY",
  "FRIDAY",
  "SATURDAY",
  "SUNDAY",
];

const DAY_SHORT: Record<DayOfWeek, string> = {
  MONDAY: "Mon",
  TUESDAY: "Tue",
  WEDNESDAY: "Wed",
  THURSDAY: "Thu",
  FRIDAY: "Fri",
  SATURDAY: "Sat",
  SUNDAY: "Sun",
};

// converts 24hr time from aws (like "14:30:00") to readable format (like "2:30 PM")
function formatTime(awsTime: string): string {
  const [h, m] = awsTime.split(":");
  const hour = parseInt(h, 10);
  const ampm = hour >= 12 ? "PM" : "AM";
  const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
  return `${displayHour}:${m} ${ampm}`;
}

export default function StudentScheduleScreen() {
  const {
    userStudents,
    userClasses,
    userTeachers,
    getClassesMappedByStudent,
    getStudentGradeInClass,
    getTeacherNamebyId,
  } = useParentLoginContext();
  const { studentId } = useLocalSearchParams<{ studentId: string }>();

  const bg = useThemeColor({}, "background");
  const cardBg = useThemeColor({}, "cardBackground");
  const textColor = useThemeColor({}, "text");
  const subtextColor = useThemeColor({}, "placeholderText");
  const tint = useThemeColor({}, "tint");
  const borderColor = useThemeColor({}, "listBorderTranslucent");

  const student = userStudents.find((s) => s.id === studentId);
  const classIds = getClassesMappedByStudent(studentId);

  // fetch schedules for all the student's classes
  const { schedules, isLoading: schedulesLoading } = useSchedules(classIds);

  // build class info rows
  const classRows = classIds
    .map((classId) => {
      const cls = userClasses.find((c) => c.id === classId);
      if (!cls) return null;
      const teacherName = getTeacherNamebyId(cls.teacherId);
      const grade = getStudentGradeInClass(studentId, classId);
      const classSchedules = schedules.filter((s) => s.classId === classId);
      return { classId, className: cls.name, teacherName, grade, classSchedules };
    })
    .filter(Boolean) as {
    classId: string;
    className: string;
    teacherName: string;
    grade: number;
    classSchedules: typeof schedules;
  }[];

  return (
    <View style={[styles.container, { backgroundColor: bg }]}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={[styles.sectionLabel, { color: subtextColor }]}>
          {student ? `${student.firstName}'s CLASSES` : "CLASS SCHEDULE"}
        </Text>

        {classRows.length === 0 ? (
          <View style={styles.empty}>
            <Text style={{ color: subtextColor, fontSize: 16 }}>No classes found</Text>
          </View>
        ) : (
          classRows.map((row) => {
            // -1 means no grade found (from getStudentGradeInClass), so treat it as null
            const gradeDisplay = row.grade != null && row.grade >= 0 ? Math.round(row.grade) : null;

            // sort schedules by day order
            const sortedSchedules = [...row.classSchedules].sort(
              (a, b) => DAY_ORDER.indexOf(a.dayOfWeek) - DAY_ORDER.indexOf(b.dayOfWeek)
            );

            return (
              <View key={row.classId} style={[styles.card, { backgroundColor: cardBg }]}>
                <View style={styles.cardRow}>
                  <View style={[styles.iconBox, { backgroundColor: tint + "20" }]}>
                    <Ionicons name="book" size={22} color={tint} />
                  </View>
                  <View style={styles.cardContent}>
                    <Text style={[styles.className, { color: textColor }]}>
                      {row.className}
                    </Text>
                    <Text style={[styles.teacherName, { color: subtextColor }]}>
                      {row.teacherName}
                    </Text>
                  </View>
                  {gradeDisplay != null && (
                    <View
                      style={[
                        styles.badge,
                        {
                          backgroundColor:
                            gradeDisplay >= 90
                              ? "#22c55e20"
                              : gradeDisplay >= 70
                              ? "#f59e0b20"
                              : "#ef444420",
                        },
                      ]}
                    >
                      <Text
                        style={[
                          styles.badgeText,
                          {
                            color:
                              gradeDisplay >= 90
                                ? "#16a34a"
                                : gradeDisplay >= 70
                                ? "#d97706"
                                : "#dc2626",
                          },
                        ]}
                      >
                        {gradeDisplay}%
                      </Text>
                    </View>
                  )}
                </View>

                {/* Schedule times */}
                {schedulesLoading ? (
                  <View style={styles.scheduleLoading}>
                    <ActivityIndicator size="small" color={subtextColor} />
                  </View>
                ) : sortedSchedules.length > 0 ? (
                  <View style={[styles.scheduleSection, { borderTopColor: borderColor }]}>
                    {sortedSchedules.map((sched) => (
                      <View key={sched.id} style={styles.scheduleRow}>
                        <View style={[styles.dayBadge, { backgroundColor: tint + "15" }]}>
                          <Text style={[styles.dayText, { color: tint }]}>
                            {DAY_SHORT[sched.dayOfWeek]}
                          </Text>
                        </View>
                        <Ionicons name="time-outline" size={14} color={subtextColor} />
                        <Text style={[styles.timeText, { color: subtextColor }]}>
                          {formatTime(sched.startTime)} - {formatTime(sched.endTime)}
                        </Text>
                      </View>
                    ))}
                  </View>
                ) : null}
              </View>
            );
          })
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 20, paddingBottom: 40 },
  sectionLabel: {
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 1,
    marginBottom: 10,
    marginLeft: 4,
  },
  empty: { alignItems: "center", paddingTop: 40 },
  card: {
    borderRadius: 14,
    padding: 16,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  cardRow: { flexDirection: "row", alignItems: "center", gap: 14 },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  cardContent: { flex: 1 },
  className: { fontSize: 16, fontWeight: "600" },
  teacherName: { fontSize: 13, marginTop: 2 },
  badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  badgeText: { fontSize: 13, fontWeight: "700" },
  scheduleSection: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    gap: 6,
  },
  scheduleLoading: { marginTop: 12, alignItems: "center" },
  scheduleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  dayBadge: {
    width: 40,
    paddingVertical: 3,
    borderRadius: 6,
    alignItems: "center",
  },
  dayText: { fontSize: 12, fontWeight: "700" },
  timeText: { fontSize: 13 },
});
