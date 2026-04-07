// teacher screen for marking attendance
// shows a list of all students in the class with present/absent/late toggle buttons
// tapping a button saves right away so the teacher doesnt have to hit a separate save button
// uses optimistic updates so the UI feels fast even if the network is slow
import { useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useGlobalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import { useThemeColor } from "@/src/features/app-themes/logic/use-theme-color";
import { useTeacherLoginContext } from "@/src/features/context/TeacherLoginContext";
import { useAttendance } from "@/src/features/attendance/logic/useAttendance";
import { AttendanceStatus } from "@/src/features/attendance/api/attendanceRepo";

// the three options a teacher can pick for each student
const STATUS_OPTIONS: { value: AttendanceStatus; label: string; icon: string; color: string }[] = [
  { value: AttendanceStatus.PRESENT, label: "Present", icon: "checkmark-circle", color: "#16a34a" },
  { value: AttendanceStatus.ABSENT, label: "Absent", icon: "close-circle", color: "#dc2626" },
  { value: AttendanceStatus.LATE, label: "Late", icon: "time", color: "#d97706" },
];

export default function TakeAttendanceScreen() {
  const { classId } = useGlobalSearchParams();
  const { userClasses } = useTeacherLoginContext();

  const classIdString = Array.isArray(classId) ? classId[0] : classId ?? "";

  const {
    isLoading,
    isSaving,
    error,
    saveAttendanceForStudent,
    getTodayStatus,
  } = useAttendance(classIdString);

  const bg = useThemeColor({}, "background");
  const cardBg = useThemeColor({}, "cardBackground");
  const textColor = useThemeColor({}, "text");
  const subtextColor = useThemeColor({}, "placeholderText");
  const tint = useThemeColor({}, "tint");
  const borderColor = useThemeColor({}, "listBorderTranslucent");

  // keeping a local copy of statuses so buttons light up immediately
  // without waiting for the api round trip. if the save fails we revert it
  const [localStatuses, setLocalStatuses] = useState<Record<string, AttendanceStatus>>({});

  const selectedClass = userClasses.find((cls) => cls.id === classIdString);
  const enrollments = selectedClass?.enrollments ?? [];
  const students = enrollments
    .map((e) => e?.student)
    .filter((s): s is NonNullable<typeof s> => Boolean(s));

  const todayStr = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  const handleToggle = async (studentId: string, status: AttendanceStatus) => {
    // optimistic update
    setLocalStatuses((prev) => ({ ...prev, [studentId]: status }));
    const success = await saveAttendanceForStudent(studentId, status);
    if (!success) {
      // revert on failure
      setLocalStatuses((prev) => {
        const next = { ...prev };
        delete next[studentId];
        return next;
      });
    }
  };

  // prefer local state over whats in the db so optimistic updates show up
  const getDisplayStatus = (studentId: string): AttendanceStatus | null => {
    return localStatuses[studentId] ?? getTodayStatus(studentId);
  };

  // count how many are marked
  const markedCount = students.filter((s) => getDisplayStatus(s.id) !== null).length;

  if (isLoading && students.length > 0) {
    return (
      <View style={[styles.container, styles.center, { backgroundColor: bg }]}>
        <ActivityIndicator size="large" color={tint} />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: bg }]}>
      {/* Header info */}
      <View style={styles.headerSection}>
        <Text style={[styles.dateText, { color: subtextColor }]}>{todayStr}</Text>
        <Text style={[styles.progressText, { color: subtextColor }]}>
          {markedCount} of {students.length} marked
        </Text>
      </View>

      {error && (
        <Text style={[styles.errorText, { color: "#dc2626" }]}>{error}</Text>
      )}

      {students.length === 0 ? (
        <View style={[styles.center, { flex: 1 }]}>
          <Ionicons name="people-outline" size={48} color={subtextColor} />
          <Text style={[styles.emptyText, { color: subtextColor }]}>
            No students enrolled
          </Text>
        </View>
      ) : (
        <FlatList
          data={students}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          renderItem={({ item: student }) => {
            const currentStatus = getDisplayStatus(student.id);
            return (
              <View style={[styles.card, { backgroundColor: cardBg }]}>
                <View style={styles.studentInfo}>
                  <View style={[styles.avatar, { backgroundColor: tint + "20" }]}>
                    <Text style={[styles.avatarText, { color: tint }]}>
                      {student.firstName[0]}
                      {student.lastName[0]}
                    </Text>
                  </View>
                  <Text style={[styles.studentName, { color: textColor }]}>
                    {student.firstName} {student.lastName}
                  </Text>
                </View>

                <View style={styles.statusRow}>
                  {STATUS_OPTIONS.map((opt) => {
                    const isActive = currentStatus === opt.value;
                    return (
                      <Pressable
                        key={opt.value}
                        style={[
                          styles.statusBtn,
                          {
                            backgroundColor: isActive
                              ? opt.color + "20"
                              : "transparent",
                            borderColor: isActive ? opt.color : borderColor,
                          },
                        ]}
                        onPress={() => handleToggle(student.id, opt.value)}
                        disabled={isSaving}
                      >
                        <Ionicons
                          name={opt.icon as any}
                          size={18}
                          color={isActive ? opt.color : subtextColor}
                        />
                        <Text
                          style={[
                            styles.statusLabel,
                            { color: isActive ? opt.color : subtextColor },
                          ]}
                        >
                          {opt.label}
                        </Text>
                      </Pressable>
                    );
                  })}
                </View>
              </View>
            );
          }}
        />
      )}

      {isSaving && (
        <View style={styles.savingBanner}>
          <ActivityIndicator size="small" color="#fff" />
          <Text style={styles.savingText}>Saving...</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { justifyContent: "center", alignItems: "center" },
  headerSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
  },
  dateText: { fontSize: 14 },
  progressText: { fontSize: 13, fontWeight: "600" },
  errorText: { textAlign: "center", marginHorizontal: 20, marginBottom: 8 },
  emptyText: { fontSize: 18, fontWeight: "600", marginTop: 16 },
  listContent: { padding: 15, paddingBottom: 80 },
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
  studentInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: { fontSize: 14, fontWeight: "700" },
  studentName: { fontSize: 16, fontWeight: "600", flex: 1 },
  statusRow: {
    flexDirection: "row",
    gap: 8,
  },
  statusBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
  },
  statusLabel: { fontSize: 13, fontWeight: "600" },
  savingBanner: {
    position: "absolute",
    bottom: 24,
    left: 24,
    right: 24,
    backgroundColor: "#0a7ea4",
    borderRadius: 12,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  savingText: { color: "#fff", fontSize: 14, fontWeight: "600" },
});
