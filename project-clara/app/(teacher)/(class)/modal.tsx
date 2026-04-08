import { useEffect, useState } from "react";
import { ActivityIndicator, Alert, Modal, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import { useThemeColor } from "@/src/features/app-themes/logic/use-theme-color";
import { useTeacherLoginContext } from "@/src/features/context/TeacherLoginContext";
import { fetchMedicalRecord, MedicalRecord } from "@/src/features/medical-records/api/medicalRecordRepo";
import { useTeacherNotes } from "@/src/features/teacher-notes/logic/useTeacherNotes";

export default function StudentDetailScreen() {
    const { studentId } = useLocalSearchParams<{ studentId: string }>();
    const { userTeacher, userClasses } = useTeacherLoginContext();

    const bg = useThemeColor({}, "background");
    const cardBg = useThemeColor({}, "cardBackground");
    const textColor = useThemeColor({}, "text");
    const subtextColor = useThemeColor({}, "placeholderText");
    const tint = useThemeColor({}, "tint");
    const borderColor = useThemeColor({}, "listBorderTranslucent");
    const modalBg = useThemeColor({}, "modalBackground");

    // find student from class enrollments
    let studentName = "Student";
    let studentGrade: number | null = null;
    let studentAttendance: number | null = null;
    let classId: string | null = null;

    for (const cls of userClasses) {
        const enrollment = cls.enrollments?.find((e) => e.student?.id === studentId);
        if (enrollment?.student) {
            studentName = `${enrollment.student.firstName} ${enrollment.student.lastName}`;
            studentGrade = enrollment.currentGrade ?? null;
            studentAttendance = enrollment.student.attendanceRate ?? null;
            classId = cls.id;
            break;
        }
    }

    const [medRecord, setMedRecord] = useState<MedicalRecord | null>(null);

    useEffect(() => {
        if (studentId) {
            fetchMedicalRecord(studentId).then((result) => {
                if (result.data) setMedRecord(result.data);
            });
        }
    }, [studentId]);

    // teacher notes
    const { notes, isLoading: notesLoading, addNote, removeNote, isSaving } = useTeacherNotes(studentId ?? "");

    const [showAddNote, setShowAddNote] = useState(false);
    const [noteTitle, setNoteTitle] = useState("");
    const [noteBody, setNoteBody] = useState("");
    const [noteCategory, setNoteCategory] = useState<string>("GENERAL");

    const CATEGORIES = [
        { key: "GENERAL", label: "General", icon: "chatbox", color: "#6b7280" },
        { key: "ACADEMIC", label: "Academic", icon: "school", color: "#3b82f6" },
        { key: "BEHAVIORAL", label: "Behavioral", icon: "alert-circle", color: "#f59e0b" },
        { key: "POSITIVE", label: "Positive", icon: "star", color: "#22c55e" },
    ];

    const handleAddNote = async () => {
        if (!noteBody.trim()) return;
        const success = await addNote({
            teacherId: userTeacher.userId,
            studentId: studentId ?? "",
            classId,
            title: noteTitle.trim() || null,
            body: noteBody.trim(),
            category: noteCategory,
        });
        if (success) {
            setShowAddNote(false);
            setNoteTitle("");
            setNoteBody("");
            setNoteCategory("GENERAL");
        } else {
            Alert.alert("Error", "Failed to save note. Please try again.");
        }
    };

    const handleDeleteNote = (noteId: string) => {
        Alert.alert("Delete Note", "Are you sure you want to delete this note?", [
            { text: "Cancel", style: "cancel" },
            { text: "Delete", style: "destructive", onPress: () => removeNote(noteId) },
        ]);
    };

    const gradeDisplay = studentGrade != null ? Math.round(studentGrade) : null;

    const formatDate = (iso: string) => {
        const d = new Date(iso);
        return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    };

    const getCategoryConfig = (cat?: string | null) =>
        CATEGORIES.find(c => c.key === cat) ?? CATEGORIES[0];

    return (
        <View style={[styles.container, { backgroundColor: bg }]}>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                {/* Header */}
                <View style={styles.headerRow}>
                    <Pressable onPress={() => router.back()} style={styles.backBtn}>
                        <Ionicons name="arrow-back" size={22} color={tint} />
                    </Pressable>
                    <View style={[styles.avatarCircle, { backgroundColor: tint }]}>
                        <Ionicons name="person" size={24} color="#fff" />
                    </View>
                    <View style={styles.headerText}>
                        <Text style={[styles.nameText, { color: textColor }]}>{studentName}</Text>
                        <View style={styles.badgeRow}>
                            {gradeDisplay != null && (
                                <View style={[styles.badge, { backgroundColor: gradeDisplay >= 90 ? "#22c55e20" : gradeDisplay >= 70 ? "#f59e0b20" : "#ef444420" }]}>
                                    <Text style={{ fontSize: 12, fontWeight: "700", color: gradeDisplay >= 90 ? "#16a34a" : gradeDisplay >= 70 ? "#d97706" : "#dc2626" }}>
                                        Grade: {gradeDisplay}%
                                    </Text>
                                </View>
                            )}
                            {studentAttendance != null && (
                                <View style={[styles.badge, { backgroundColor: tint + "20" }]}>
                                    <Text style={{ fontSize: 12, fontWeight: "700", color: tint }}>
                                        Attend: {Math.round(studentAttendance)}%
                                    </Text>
                                </View>
                            )}
                        </View>
                    </View>
                </View>

                {/* Medical Info */}
                <View style={[styles.section, { borderTopColor: borderColor }]}>
                    <Text style={[styles.sectionTitle, { color: subtextColor }]}>MEDICAL INFO</Text>
                    {medRecord ? (
                        <View style={[styles.infoCard, { backgroundColor: cardBg }]}>
                            {medRecord.allergies && (
                                <InfoRow icon="warning" label="Allergies" value={medRecord.allergies} color="#dc2626" textColor={textColor} subtextColor={subtextColor} />
                            )}
                            {medRecord.medications && (
                                <InfoRow icon="medkit" label="Medications" value={medRecord.medications} color="#3b82f6" textColor={textColor} subtextColor={subtextColor} />
                            )}
                            {medRecord.conditions && (
                                <InfoRow icon="fitness" label="Conditions" value={medRecord.conditions} color="#d97706" textColor={textColor} subtextColor={subtextColor} />
                            )}
                            {!medRecord.allergies && !medRecord.medications && !medRecord.conditions && (
                                <Text style={[styles.noData, { color: subtextColor }]}>No medical concerns on file</Text>
                            )}
                        </View>
                    ) : (
                        <View style={[styles.infoCard, { backgroundColor: cardBg }]}>
                            <Text style={[styles.noData, { color: subtextColor }]}>No medical records found</Text>
                        </View>
                    )}
                </View>

                {/* Emergency Notes from medical record */}
                {medRecord?.emergencyNotes && (
                    <View style={styles.section}>
                        <Text style={[styles.sectionTitle, { color: subtextColor }]}>EMERGENCY NOTES</Text>
                        <View style={[styles.infoCard, { backgroundColor: cardBg }]}>
                            <InfoRow icon="call" label="Notes" value={medRecord.emergencyNotes} color="#3b82f6" textColor={textColor} subtextColor={subtextColor} />
                        </View>
                    </View>
                )}

                {/* Teacher Notes */}
                <View style={[styles.section, { borderTopColor: borderColor }]}>
                    <View style={styles.sectionHeader}>
                        <Text style={[styles.sectionTitle, { color: subtextColor, marginBottom: 0 }]}>MY NOTES</Text>
                        <Pressable
                            style={[styles.addBtn, { backgroundColor: tint }]}
                            onPress={() => setShowAddNote(true)}
                        >
                            <Ionicons name="add" size={16} color="#fff" />
                            <Text style={styles.addBtnText}>Add</Text>
                        </Pressable>
                    </View>

                    {notesLoading ? (
                        <ActivityIndicator size="small" color={tint} style={{ marginTop: 12 }} />
                    ) : notes.length === 0 ? (
                        <View style={[styles.infoCard, { backgroundColor: cardBg, marginTop: 10 }]}>
                            <Text style={[styles.noData, { color: subtextColor }]}>No notes yet. Tap "Add" to write one.</Text>
                        </View>
                    ) : (
                        <View style={{ marginTop: 10, gap: 8 }}>
                            {notes.map((note) => {
                                const cat = getCategoryConfig(note.category);
                                return (
                                    <View key={note.id} style={[styles.noteCard, { backgroundColor: cardBg }]}>
                                        <View style={styles.noteHeader}>
                                            <View style={[styles.catBadge, { backgroundColor: cat.color + "20" }]}>
                                                <Ionicons name={cat.icon as any} size={12} color={cat.color} />
                                                <Text style={{ fontSize: 11, fontWeight: "600", color: cat.color, marginLeft: 4 }}>{cat.label}</Text>
                                            </View>
                                            <Text style={{ fontSize: 11, color: subtextColor }}>{formatDate(note.createdAt)}</Text>
                                            <Pressable onPress={() => handleDeleteNote(note.id)} hitSlop={8}>
                                                <Ionicons name="trash-outline" size={14} color="#dc2626" />
                                            </Pressable>
                                        </View>
                                        {note.title && (
                                            <Text style={[styles.noteTitle, { color: textColor }]}>{note.title}</Text>
                                        )}
                                        <Text style={[styles.noteBody, { color: textColor }]}>{note.body}</Text>
                                    </View>
                                );
                            })}
                        </View>
                    )}
                </View>
            </ScrollView>

            {/* Add Note — inline form instead of RN Modal for web compatibility */}
            {showAddNote && (
                <View style={styles.addNoteOverlay}>
                    <View style={[styles.addNoteSheet, { backgroundColor: modalBg }]}>
                        <Text style={[styles.addNoteTitle, { color: textColor }]}>Add Note</Text>

                        {/* Category pills */}
                        <View style={styles.categoryRow}>
                            {CATEGORIES.map(cat => (
                                <Pressable
                                    key={cat.key}
                                    style={[
                                        styles.categoryPill,
                                        { borderColor: cat.color },
                                        noteCategory === cat.key && { backgroundColor: cat.color + "20" },
                                    ]}
                                    onPress={() => setNoteCategory(cat.key)}
                                >
                                    <Ionicons name={cat.icon as any} size={12} color={cat.color} />
                                    <Text style={{ fontSize: 12, fontWeight: "600", color: cat.color, marginLeft: 4 }}>{cat.label}</Text>
                                </Pressable>
                            ))}
                        </View>

                        <TextInput
                            style={[styles.input, { color: textColor, borderColor, backgroundColor: cardBg }]}
                            value={noteTitle}
                            onChangeText={setNoteTitle}
                            placeholder="Title (optional)"
                            placeholderTextColor={subtextColor}
                        />

                        <TextInput
                            style={[styles.input, styles.textArea, { color: textColor, borderColor, backgroundColor: cardBg }]}
                            value={noteBody}
                            onChangeText={setNoteBody}
                            placeholder="Write your note..."
                            placeholderTextColor={subtextColor}
                            multiline
                        />

                        <View style={styles.formButtons}>
                            <Pressable
                                style={[styles.formBtn, { backgroundColor: subtextColor + "20" }]}
                                onPress={() => setShowAddNote(false)}
                            >
                                <Text style={[styles.formBtnText, { color: textColor }]}>Cancel</Text>
                            </Pressable>
                            <Pressable
                                style={[styles.formBtn, { backgroundColor: tint, opacity: isSaving || !noteBody.trim() ? 0.5 : 1 }]}
                                onPress={handleAddNote}
                                disabled={isSaving || !noteBody.trim()}
                            >
                                <Text style={[styles.formBtnText, { color: "#fff" }]}>
                                    {isSaving ? "Saving..." : "Save"}
                                </Text>
                            </Pressable>
                        </View>
                    </View>
                </View>
            )}
        </View>
    );
}

function InfoRow({ icon, label, value, color, textColor, subtextColor }: {
    icon: any; label: string; value: string; color: string; textColor: string; subtextColor: string;
}) {
    return (
        <View style={styles.infoRow}>
            <Ionicons name={icon} size={18} color={color} />
            <View style={{ flex: 1, marginLeft: 10 }}>
                <Text style={{ fontSize: 12, color: subtextColor }}>{label}</Text>
                <Text style={{ fontSize: 14, fontWeight: "500", color: textColor }}>{value}</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    scrollContent: { padding: 20, paddingBottom: 40 },
    headerRow: { flexDirection: "row", alignItems: "center", gap: 12, marginBottom: 20 },
    backBtn: { width: 36, height: 36, borderRadius: 18, alignItems: "center", justifyContent: "center" },
    avatarCircle: { width: 48, height: 48, borderRadius: 24, alignItems: "center", justifyContent: "center" },
    headerText: { flex: 1 },
    nameText: { fontSize: 20, fontWeight: "700" },
    badgeRow: { flexDirection: "row", gap: 8, marginTop: 6 },
    badge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
    section: { marginTop: 16, paddingTop: 16, borderTopWidth: 1, borderTopColor: "transparent" },
    sectionHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
    sectionTitle: { fontSize: 12, fontWeight: "700", letterSpacing: 1, marginBottom: 10 },
    infoCard: { borderRadius: 12, padding: 12 },
    infoRow: { flexDirection: "row", alignItems: "center", paddingVertical: 8 },
    noData: { fontSize: 14, padding: 4 },
    addBtn: { flexDirection: "row", alignItems: "center", paddingHorizontal: 10, paddingVertical: 5, borderRadius: 8, gap: 4 },
    addBtnText: { fontSize: 13, fontWeight: "600", color: "#fff" },
    noteCard: { borderRadius: 12, padding: 12 },
    noteHeader: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 6 },
    catBadge: { flexDirection: "row", alignItems: "center", paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4, flex: 1 },
    noteTitle: { fontSize: 15, fontWeight: "600", marginBottom: 2 },
    noteBody: { fontSize: 14, lineHeight: 20 },
    // inline add-note form (replaces RN Modal for web compat)
    addNoteOverlay: { position: "absolute", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "center", alignItems: "center", zIndex: 100 },
    addNoteSheet: { width: "90%", maxWidth: 420, borderRadius: 16, padding: 24 },
    addNoteTitle: { fontSize: 20, fontWeight: "700", marginBottom: 16 },
    categoryRow: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 16 },
    categoryPill: { flexDirection: "row", alignItems: "center", paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8, borderWidth: 1 },
    input: { borderWidth: 1, borderRadius: 12, padding: 12, fontSize: 15, marginBottom: 12 },
    textArea: { minHeight: 100, textAlignVertical: "top" },
    formButtons: { flexDirection: "row", gap: 12, marginTop: 4 },
    formBtn: { flex: 1, paddingVertical: 12, borderRadius: 10, alignItems: "center" },
    formBtnText: { fontSize: 15, fontWeight: "600" },
});
