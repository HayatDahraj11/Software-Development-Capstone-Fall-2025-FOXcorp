import { useCallback, useState } from "react";
import { Alert, Dimensions, FlatList, Modal, Platform, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { useGlobalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { BarChart } from "react-native-chart-kit";

import { useThemeColor } from "@/src/features/app-themes/logic/use-theme-color";
import { useTeacherLoginContext } from "@/src/features/context/TeacherLoginContext";
import { updateStudentGrade } from "@/src/features/grades/api/gradesRepo";

const screenWidth = Dimensions.get("window").width;

function getLetterGrade(grade: number): string {
  if (grade >= 90) return "A";
  if (grade >= 80) return "B";
  if (grade >= 70) return "C";
  if (grade >= 60) return "D";
  return "F";
}

function gradeColor(g: number) {
  return g >= 90 ? "#16a34a" : g >= 70 ? "#d97706" : "#dc2626";
}
function gradeBg(g: number) {
  return g >= 90 ? "#22c55e20" : g >= 70 ? "#f59e0b20" : "#ef444420";
}

export default function GradesScreen() {
  const { classId } = useGlobalSearchParams();
  const { userClasses } = useTeacherLoginContext();

  const bg = useThemeColor({}, "background");
  const cardBg = useThemeColor({}, "cardBackground");
  const textColor = useThemeColor({}, "text");
  const subtextColor = useThemeColor({}, "placeholderText");
  const tint = useThemeColor({}, "tint");
  const borderColor = useThemeColor({}, "listBorderTranslucent");
  const modalBg = useThemeColor({}, "modalBackground");

  const classIdString = Array.isArray(classId) ? classId[0] : classId;
  const selectedClass = userClasses.find((cls) => cls.id === classIdString);
  const enrollments = selectedClass?.enrollments ?? [];

  // local grade overrides so UI updates instantly after save
  const [gradeOverrides, setGradeOverrides] = useState<Record<string, number>>({});

  const students = enrollments
    .map((enrollment) => {
      const student = enrollment?.student;
      if (!student) return null;
      const overridden = gradeOverrides[enrollment.id];
      return {
        id: student.id,
        enrollmentId: enrollment.id,
        name: `${student.firstName} ${student.lastName}`,
        initials: `${student.firstName.charAt(0)}${student.lastName.charAt(0)}`,
        grade: overridden ?? enrollment.currentGrade ?? null,
      };
    })
    .filter(Boolean) as { id: string; enrollmentId: string; name: string; initials: string; grade: number | null }[];

  const gradedStudents = students.filter((s) => s.grade != null);
  const hasGrades = gradedStudents.length > 0;
  const classAverage = hasGrades
    ? Math.round(gradedStudents.reduce((sum, s) => sum + (s.grade ?? 0), 0) / gradedStudents.length)
    : 0;

  const countA = gradedStudents.filter((s) => (s.grade ?? 0) >= 90).length;
  const countB = gradedStudents.filter((s) => (s.grade ?? 0) >= 80 && (s.grade ?? 0) < 90).length;
  const countC = gradedStudents.filter((s) => (s.grade ?? 0) >= 70 && (s.grade ?? 0) < 80).length;
  const countD = gradedStudents.filter((s) => (s.grade ?? 0) >= 60 && (s.grade ?? 0) < 70).length;
  const countF = gradedStudents.filter((s) => (s.grade ?? 0) < 60).length;

  // edit modal state
  const [editStudent, setEditStudent] = useState<typeof students[0] | null>(null);
  const [editValue, setEditValue] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const openEdit = useCallback((student: typeof students[0]) => {
    setEditStudent(student);
    setEditValue(student.grade != null ? String(Math.round(student.grade)) : "");
  }, []);

  const saveGrade = useCallback(async () => {
    if (!editStudent) return;
    const parsed = parseFloat(editValue);
    if (isNaN(parsed) || parsed < 0 || parsed > 100) {
      Alert.alert("Invalid Grade", "Please enter a number between 0 and 100.");
      return;
    }
    setIsSaving(true);
    const result = await updateStudentGrade(editStudent.enrollmentId, parsed);
    setIsSaving(false);

    if (result.error) {
      Alert.alert("Error", result.error);
      return;
    }

    // optimistic update
    setGradeOverrides((prev) => ({ ...prev, [editStudent.enrollmentId]: parsed }));
    setEditStudent(null);
  }, [editStudent, editValue]);

  const renderHeader = () => (
    <View>
      <View style={styles.headerSection}>
        <Text style={[styles.title, { color: textColor }]}>Grades</Text>
        <View style={[styles.countBadge, { backgroundColor: tint + "18" }]}>
          <Text style={[styles.countText, { color: tint }]}>
            {students.length} {students.length === 1 ? "Student" : "Students"}
          </Text>
        </View>
      </View>

      {hasGrades && (
        <View style={[styles.averageCard, { backgroundColor: cardBg }]}>
          <View style={styles.averageRow}>
            <View>
              <Text style={[styles.averageLabel, { color: subtextColor }]}>Class Average</Text>
              <View style={styles.averageValueRow}>
                <Text style={[styles.averageNumber, { color: gradeColor(classAverage) }]}>
                  {classAverage}%
                </Text>
                <View style={[styles.letterBadge, { backgroundColor: gradeBg(classAverage) }]}>
                  <Text style={[styles.letterBadgeText, { color: gradeColor(classAverage) }]}>
                    {getLetterGrade(classAverage)}
                  </Text>
                </View>
              </View>
            </View>
            <View style={[styles.averageIcon, { backgroundColor: tint + "15" }]}>
              <Ionicons name="school" size={28} color={tint} />
            </View>
          </View>
        </View>
      )}

      {hasGrades && (
        <View style={[styles.chartCard, { backgroundColor: cardBg }]}>
          <Text style={[styles.chartTitle, { color: textColor }]}>Grade Distribution</Text>
          <BarChart
            data={{
              labels: ["A", "B", "C", "D", "F"],
              datasets: [{ data: [countA, countB, countC, countD, countF] }],
            }}
            width={screenWidth - 72}
            height={200}
            yAxisLabel=""
            yAxisSuffix=""
            chartConfig={{
              backgroundColor: cardBg,
              backgroundGradientFrom: cardBg,
              backgroundGradientTo: cardBg,
              decimalPlaces: 0,
              color: () => tint,
              labelColor: () => textColor,
              barPercentage: 0.7,
              propsForBackgroundLines: {
                strokeDasharray: "",
                stroke: subtextColor + "30",
              },
            }}
            style={{ borderRadius: 14 }}
          />
        </View>
      )}

      <View style={styles.sectionRow}>
        <Text style={[styles.sectionLabel, { color: subtextColor }]}>ALL STUDENTS</Text>
        <Text style={[styles.sectionHint, { color: subtextColor }]}>Tap to edit grade</Text>
      </View>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: bg }]}>
      <FlatList
        data={students}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons name="school-outline" size={48} color={subtextColor} />
            <Text style={[styles.emptyText, { color: subtextColor }]}>No students found</Text>
          </View>
        }
        renderItem={({ item }) => {
          const gradeDisplay = item.grade != null ? Math.round(item.grade) : null;
          const letter = gradeDisplay != null ? getLetterGrade(gradeDisplay) : null;

          return (
            <Pressable
              style={({ pressed }) => [styles.card, { backgroundColor: cardBg, opacity: pressed ? 0.85 : 1 }]}
              onPress={() => openEdit(item)}
            >
              <View style={styles.cardRow}>
                <View style={[styles.avatarCircle, { backgroundColor: tint + "20" }]}>
                  <Text style={[styles.avatarText, { color: tint }]}>{item.initials}</Text>
                </View>
                <View style={styles.cardContent}>
                  <Text style={[styles.studentName, { color: textColor }]}>{item.name}</Text>
                  {letter && (
                    <Text style={[styles.letterLabel, { color: subtextColor }]}>Grade: {letter}</Text>
                  )}
                </View>
                {gradeDisplay != null ? (
                  <View style={[styles.badge, { backgroundColor: gradeBg(gradeDisplay) }]}>
                    <Text style={[styles.badgeText, { color: gradeColor(gradeDisplay) }]}>
                      {gradeDisplay}%
                    </Text>
                  </View>
                ) : (
                  <View style={[styles.badge, { backgroundColor: subtextColor + "20" }]}>
                    <Text style={[styles.badgeText, { color: subtextColor }]}>N/A</Text>
                  </View>
                )}
                <Ionicons name="pencil" size={16} color={subtextColor} style={{ marginLeft: 6 }} />
              </View>
            </Pressable>
          );
        }}
      />

      {/* Grade Edit Modal */}
      <Modal visible={!!editStudent} transparent animationType="fade" onRequestClose={() => setEditStudent(null)}>
        <Pressable style={styles.modalOverlay} onPress={() => setEditStudent(null)}>
          <Pressable style={[styles.modalSheet, { backgroundColor: modalBg }]} onPress={(e) => e.stopPropagation()}>
            <Text style={[styles.modalTitle, { color: textColor }]}>
              Edit Grade
            </Text>
            <Text style={[styles.modalSubtitle, { color: subtextColor }]}>
              {editStudent?.name}
            </Text>

            <TextInput
              style={[styles.gradeInput, { color: textColor, borderColor, backgroundColor: cardBg }]}
              value={editValue}
              onChangeText={setEditValue}
              placeholder="Enter grade (0-100)"
              placeholderTextColor={subtextColor}
              keyboardType="numeric"
              maxLength={5}
              autoFocus={Platform.OS !== "web"}
              selectTextOnFocus
            />

            <View style={styles.modalButtons}>
              <Pressable
                style={[styles.modalBtn, { backgroundColor: subtextColor + "20" }]}
                onPress={() => setEditStudent(null)}
              >
                <Text style={[styles.modalBtnText, { color: textColor }]}>Cancel</Text>
              </Pressable>
              <Pressable
                style={[styles.modalBtn, { backgroundColor: tint, opacity: isSaving ? 0.6 : 1 }]}
                onPress={saveGrade}
                disabled={isSaving}
              >
                <Text style={[styles.modalBtnText, { color: "#fff" }]}>
                  {isSaving ? "Saving..." : "Save"}
                </Text>
              </Pressable>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  listContent: { padding: 20, paddingBottom: 40 },
  headerSection: { marginBottom: 20 },
  title: { fontSize: 24, fontWeight: "700", marginBottom: 8 },
  countBadge: { alignSelf: "flex-start", paddingHorizontal: 12, paddingVertical: 5, borderRadius: 16 },
  countText: { fontSize: 13, fontWeight: "600" },
  averageCard: {
    borderRadius: 16, padding: 20, marginBottom: 16,
    shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.07, shadowRadius: 6, elevation: 3,
  },
  averageRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  averageLabel: { fontSize: 14, marginBottom: 4 },
  averageValueRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  averageNumber: { fontSize: 40, fontWeight: "800" },
  letterBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  letterBadgeText: { fontSize: 18, fontWeight: "700" },
  averageIcon: { width: 52, height: 52, borderRadius: 16, alignItems: "center", justifyContent: "center" },
  chartCard: {
    borderRadius: 16, padding: 16, marginBottom: 20, alignItems: "center",
    shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 4, elevation: 2,
  },
  chartTitle: { fontSize: 16, fontWeight: "600", marginBottom: 8, alignSelf: "flex-start" },
  sectionRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 10, marginLeft: 4, marginRight: 4 },
  sectionLabel: { fontSize: 12, fontWeight: "700", letterSpacing: 1 },
  sectionHint: { fontSize: 11, fontStyle: "italic" },
  empty: { alignItems: "center", paddingTop: 40, gap: 12 },
  emptyText: { fontSize: 16 },
  card: {
    borderRadius: 14, padding: 16, marginBottom: 10,
    shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 4, elevation: 2,
  },
  cardRow: { flexDirection: "row", alignItems: "center", gap: 14 },
  avatarCircle: { width: 44, height: 44, borderRadius: 22, alignItems: "center", justifyContent: "center" },
  avatarText: { fontSize: 15, fontWeight: "700" },
  cardContent: { flex: 1 },
  studentName: { fontSize: 16, fontWeight: "600" },
  letterLabel: { fontSize: 13, marginTop: 2 },
  badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  badgeText: { fontSize: 13, fontWeight: "700" },
  // modal
  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.4)", justifyContent: "center", alignItems: "center" },
  modalSheet: { width: "85%", maxWidth: 360, borderRadius: 16, padding: 24 },
  modalTitle: { fontSize: 20, fontWeight: "700", marginBottom: 4 },
  modalSubtitle: { fontSize: 15, marginBottom: 20 },
  gradeInput: { borderWidth: 1, borderRadius: 12, padding: 14, fontSize: 18, fontWeight: "600", textAlign: "center", marginBottom: 20 },
  modalButtons: { flexDirection: "row", gap: 12 },
  modalBtn: { flex: 1, paddingVertical: 12, borderRadius: 10, alignItems: "center" },
  modalBtnText: { fontSize: 15, fontWeight: "600" },
});
