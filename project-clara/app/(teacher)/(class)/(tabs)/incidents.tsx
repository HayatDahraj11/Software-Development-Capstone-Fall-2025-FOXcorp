// teacher screen for viewing and reporting behavioral incidents
// shows past incidents grouped by date, same layout pattern as announcements
// the + button opens a bottom sheet where you pick a student, severity, and describe what happened
import { useState } from "react";
import {
  ActivityIndicator,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import { useThemeColor } from "@/src/features/app-themes/logic/use-theme-color";
import { useTeacherLoginContext } from "@/src/features/context/TeacherLoginContext";
import { useIncidents } from "@/src/features/incidents/logic/useIncidents";

const SEVERITY_OPTIONS = ["Low", "Medium", "High", "Critical"];

// color coding for each severity level, bg is the light background tint
const SEVERITY_COLORS: Record<string, { bg: string; text: string }> = {
  Low: { bg: "#22c55e20", text: "#16a34a" },
  Medium: { bg: "#f59e0b20", text: "#d97706" },
  High: { bg: "#ef444420", text: "#dc2626" },
  Critical: { bg: "#7c3aed20", text: "#7c3aed" },
};

export default function IncidentsScreen() {
  const { classId } = useLocalSearchParams();
  const { userTeacher, userClasses } = useTeacherLoginContext();

  const classIdString = Array.isArray(classId) ? classId[0] : classId ?? "";
  const selectedClass = userClasses.find((cls) => cls.id === classIdString);
  const schoolId = selectedClass?.schoolId ?? "";

  const { incidents, isLoading, error, createIncident } =
    useIncidents(classIdString);

  const bg = useThemeColor({}, "background");
  const cardBg = useThemeColor({}, "cardBackground");
  const textColor = useThemeColor({}, "text");
  const subtextColor = useThemeColor({}, "placeholderText");
  const tint = useThemeColor({}, "tint");
  const borderColor = useThemeColor({}, "listBorderTranslucent");

  // modal state
  const [showCreate, setShowCreate] = useState(false);
  const [description, setDescription] = useState("");
  const [severity, setSeverity] = useState("Medium");
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
  const [isSending, setIsSending] = useState(false);
  const [showStudentPicker, setShowStudentPicker] = useState(false);

  // get students from enrollments
  const enrollments = selectedClass?.enrollments ?? [];
  const students = enrollments
    .map((e) => e?.student)
    .filter((s): s is NonNullable<typeof s> => Boolean(s));

  const selectedStudent = students.find((s) => s.id === selectedStudentId);

  const handleCreate = async () => {
    if (!description.trim() || !selectedStudentId) return;
    setIsSending(true);
    const success = await createIncident({
      description: description.trim(),
      severity,
      studentId: selectedStudentId,
      teacherId: userTeacher.userId,
      classId: classIdString,
      schoolId,
    });
    setIsSending(false);
    if (success) {
      setDescription("");
      setSeverity("Medium");
      setSelectedStudentId(null);
      setShowCreate(false);
    }
  };

  // wipe the form and close the modal
  const resetAndClose = () => {
    setShowCreate(false);
    setDescription("");
    setSeverity("Medium");
    setSelectedStudentId(null);
    setShowStudentPicker(false);
  };

  // group incidents by date so we can show them with date dividers like announcements
  // adding T00:00:00 so the date doesnt get timezone shifted to the wrong day
  const grouped: Record<string, typeof incidents> = {};
  for (const inc of incidents) {
    const dateStr = inc.date
      ? new Date(inc.date + "T00:00:00").toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        })
      : "Unknown Date";
    if (!grouped[dateStr]) grouped[dateStr] = [];
    grouped[dateStr].push(inc);
  }

  if (isLoading && incidents.length === 0) {
    return (
      <View style={[styles.container, styles.center, { backgroundColor: bg }]}>
        <ActivityIndicator size="large" color={tint} />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: bg }]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {error && (
          <Text style={[styles.errorText, { color: "#dc2626" }]}>{error}</Text>
        )}

        {incidents.length === 0 && !error ? (
          <View style={styles.center}>
            <Ionicons name="shield-checkmark-outline" size={48} color={subtextColor} />
            <Text style={[styles.emptyText, { color: subtextColor }]}>
              No incidents reported
            </Text>
            <Text style={[styles.emptySubtext, { color: subtextColor }]}>
              Tap + to report one
            </Text>
          </View>
        ) : (
          Object.keys(grouped).map((dateStr) => (
            <View key={dateStr} style={styles.section}>
              <View style={styles.dateRow}>
                <View style={[styles.line, { backgroundColor: borderColor }]} />
                <Text style={[styles.dateText, { color: subtextColor }]}>{dateStr}</Text>
                <View style={[styles.line, { backgroundColor: borderColor }]} />
              </View>

              {grouped[dateStr].map((inc) => {
                const sevColors = SEVERITY_COLORS[inc.severity] ?? SEVERITY_COLORS.Medium;
                return (
                  <View key={inc.id} style={[styles.card, { backgroundColor: cardBg }]}>
                    <View style={styles.cardHeader}>
                      <View style={[styles.iconBox, { backgroundColor: "#ef444420" }]}>
                        <Ionicons name="warning" size={18} color="#dc2626" />
                      </View>
                      <View style={styles.cardHeaderText}>
                        <Text style={[styles.cardTitle, { color: textColor }]}>
                          {inc.student
                            ? `${inc.student.firstName} ${inc.student.lastName}`
                            : "Student"}
                        </Text>
                      </View>
                      <View style={[styles.severityBadge, { backgroundColor: sevColors.bg }]}>
                        <Text style={[styles.severityText, { color: sevColors.text }]}>
                          {inc.severity}
                        </Text>
                      </View>
                    </View>
                    <Text style={[styles.cardBody, { color: subtextColor }]}>
                      {inc.description}
                    </Text>
                  </View>
                );
              })}
            </View>
          ))
        )}
      </ScrollView>

      {/* FAB */}
      <Pressable style={styles.fab} onPress={() => setShowCreate(true)}>
        <Ionicons name="add" size={28} color="#fff" />
      </Pressable>

      {/* Create Modal */}
      <Modal
        visible={showCreate}
        animationType="slide"
        transparent
        onRequestClose={resetAndClose}
      >
        <View style={styles.overlay}>
          <View style={[styles.sheet, { backgroundColor: bg }]}>
            <View style={[styles.sheetHeader, { borderBottomColor: borderColor }]}>
              <Text style={[styles.sheetTitle, { color: textColor }]}>
                Report Incident
              </Text>
              <Pressable onPress={resetAndClose}>
                <Text style={{ color: subtextColor, fontSize: 16 }}>Cancel</Text>
              </Pressable>
            </View>

            {/* Student Picker */}
            <Text style={[styles.fieldLabel, { color: subtextColor }]}>Student</Text>
            <Pressable
              style={[styles.pickerBtn, { backgroundColor: cardBg, borderColor }]}
              onPress={() => setShowStudentPicker(!showStudentPicker)}
            >
              <Text
                style={{
                  color: selectedStudent ? textColor : subtextColor,
                  fontSize: 16,
                }}
              >
                {selectedStudent
                  ? `${selectedStudent.firstName} ${selectedStudent.lastName}`
                  : "Select a student..."}
              </Text>
              <Ionicons
                name={showStudentPicker ? "chevron-up" : "chevron-down"}
                size={20}
                color={subtextColor}
              />
            </Pressable>

            {showStudentPicker && (
              <View style={[styles.pickerList, { backgroundColor: cardBg, borderColor }]}>
                <ScrollView style={{ maxHeight: 150 }} nestedScrollEnabled>
                  {students.map((s) => (
                    <Pressable
                      key={s.id}
                      style={[
                        styles.pickerItem,
                        { borderBottomColor: borderColor },
                        s.id === selectedStudentId && {
                          backgroundColor: tint + "15",
                        },
                      ]}
                      onPress={() => {
                        setSelectedStudentId(s.id);
                        setShowStudentPicker(false);
                      }}
                    >
                      <Text style={{ color: textColor, fontSize: 15 }}>
                        {s.firstName} {s.lastName}
                      </Text>
                    </Pressable>
                  ))}
                </ScrollView>
              </View>
            )}

            {/* Severity */}
            <Text style={[styles.fieldLabel, { color: subtextColor, marginTop: 12 }]}>
              Severity
            </Text>
            <View style={styles.severityRow}>
              {SEVERITY_OPTIONS.map((sev) => {
                const isActive = severity === sev;
                const colors = SEVERITY_COLORS[sev];
                return (
                  <Pressable
                    key={sev}
                    style={[
                      styles.severityOption,
                      {
                        backgroundColor: isActive ? colors.bg : "transparent",
                        borderColor: isActive ? colors.text : borderColor,
                      },
                    ]}
                    onPress={() => setSeverity(sev)}
                  >
                    <Text
                      style={{
                        color: isActive ? colors.text : subtextColor,
                        fontSize: 13,
                        fontWeight: "600",
                      }}
                    >
                      {sev}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            {/* Description */}
            <Text style={[styles.fieldLabel, { color: subtextColor, marginTop: 12 }]}>
              Description
            </Text>
            <TextInput
              style={[
                styles.input,
                styles.bodyInput,
                { backgroundColor: cardBg, color: textColor, borderColor },
              ]}
              placeholder="Describe what happened..."
              placeholderTextColor={subtextColor}
              multiline
              value={description}
              onChangeText={setDescription}
            />

            <Pressable
              style={[
                styles.sendBtn,
                {
                  backgroundColor: tint,
                  opacity:
                    !description.trim() || !selectedStudentId || isSending
                      ? 0.5
                      : 1,
                },
              ]}
              onPress={handleCreate}
              disabled={!description.trim() || !selectedStudentId || isSending}
            >
              <Text style={styles.sendBtnText}>
                {isSending ? "Submitting..." : "Submit Report"}
              </Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { flex: 1, alignItems: "center", justifyContent: "center", padding: 32 },
  scrollContent: { padding: 15, paddingBottom: 80 },
  errorText: { textAlign: "center", marginBottom: 12 },
  emptyText: { fontSize: 18, fontWeight: "600", marginTop: 16 },
  emptySubtext: { fontSize: 14, marginTop: 4 },
  section: { marginBottom: 16 },
  dateRow: { flexDirection: "row", alignItems: "center", marginVertical: 10 },
  line: { flex: 1, height: 1 },
  dateText: { marginHorizontal: 10, fontSize: 14 },
  card: {
    borderRadius: 14,
    padding: 16,
    marginBottom: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  cardHeader: { flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 8 },
  iconBox: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  cardHeaderText: { flex: 1 },
  cardTitle: { fontSize: 16, fontWeight: "600" },
  cardBody: { fontSize: 14, lineHeight: 20 },
  severityBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  severityText: { fontSize: 12, fontWeight: "700" },
  fab: {
    position: "absolute",
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#0a7ea4",
    alignItems: "center",
    justifyContent: "center",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  overlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.4)", justifyContent: "flex-end" },
  sheet: {
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 20,
    paddingBottom: 40,
  },
  sheetHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingBottom: 16,
    marginBottom: 16,
    borderBottomWidth: 1,
  },
  sheetTitle: { fontSize: 18, fontWeight: "bold" },
  fieldLabel: { fontSize: 12, fontWeight: "700", letterSpacing: 0.5, marginBottom: 6, marginLeft: 4 },
  pickerBtn: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    marginBottom: 4,
  },
  pickerList: {
    borderWidth: 1,
    borderTopWidth: 0,
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
    marginBottom: 4,
    overflow: "hidden",
  },
  pickerItem: {
    padding: 12,
    borderBottomWidth: 1,
  },
  severityRow: { flexDirection: "row", gap: 8, marginBottom: 4 },
  severityOption: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: "center",
  },
  input: { borderWidth: 1, borderRadius: 12, padding: 12, fontSize: 16, marginBottom: 12 },
  bodyInput: { minHeight: 100, textAlignVertical: "top" },
  sendBtn: { borderRadius: 12, padding: 16, alignItems: "center" },
  sendBtnText: { color: "#fff", fontSize: 16, fontWeight: "700" },
});
