import { useEffect, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import { useThemeColor } from "@/src/features/app-themes/logic/use-theme-color";
import { useTeacherLoginContext } from "@/src/features/context/TeacherLoginContext";
import { fetchMedicalRecord, MedicalRecord } from "@/src/features/medical-records/api/medicalRecordRepo";

export default function StudentDetailModal() {
    const { studentId } = useLocalSearchParams<{ studentId: string }>();
    const { userClasses } = useTeacherLoginContext();

    const bg = useThemeColor({}, "background");
    const cardBg = useThemeColor({}, "cardBackground");
    const textColor = useThemeColor({}, "text");
    const subtextColor = useThemeColor({}, "placeholderText");
    const tint = useThemeColor({}, "tint");
    const borderColor = useThemeColor({}, "listBorderTranslucent");

    // find student from class enrollments
    let studentName = "Student";
    let studentGrade: number | null = null;
    let studentAttendance: number | null = null;

    for (const cls of userClasses) {
        const enrollment = cls.enrollments?.find((e) => e.student?.id === studentId);
        if (enrollment?.student) {
            studentName = `${enrollment.student.firstName} ${enrollment.student.lastName}`;
            studentGrade = enrollment.currentGrade ?? null;
            studentAttendance = enrollment.student.attendanceRate ?? null;
            break;
        }
    }

    const [medRecord, setMedRecord] = useState<MedicalRecord | null>(null);
    const [notes, setNotes] = useState("");

    useEffect(() => {
        if (studentId) {
            fetchMedicalRecord(studentId).then((result) => {
                if (result.data) setMedRecord(result.data);
            });
        }
    }, [studentId]);

    const gradeDisplay = studentGrade != null ? Math.round(studentGrade) : null;

    return (
        <Pressable style={styles.overlay} onPress={() => router.back()}>
            <Pressable style={[styles.sheet, { backgroundColor: bg }]} onPress={(e) => e.stopPropagation()}>
                <ScrollView showsVerticalScrollIndicator={false}>
                    {/* Header */}
                    <View style={styles.headerRow}>
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
                        <Pressable onPress={() => router.back()}>
                            <Ionicons name="close" size={24} color={subtextColor} />
                        </Pressable>
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

                    {/* Notes */}
                    <View style={styles.section}>
                        <Text style={[styles.sectionTitle, { color: subtextColor }]}>TEACHER NOTES</Text>
                        <TextInput
                            style={[styles.textInput, { backgroundColor: cardBg, color: textColor, borderColor }]}
                            placeholder="Add notes about this student..."
                            placeholderTextColor={subtextColor}
                            multiline
                            value={notes}
                            onChangeText={setNotes}
                        />
                    </View>
                </ScrollView>
            </Pressable>
        </Pressable>
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
    overlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.4)", justifyContent: "flex-end" },
    sheet: { maxHeight: "75%", borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 20, paddingBottom: 40 },
    headerRow: { flexDirection: "row", alignItems: "center", gap: 12, marginBottom: 20 },
    avatarCircle: { width: 48, height: 48, borderRadius: 24, alignItems: "center", justifyContent: "center" },
    headerText: { flex: 1 },
    nameText: { fontSize: 20, fontWeight: "700" },
    badgeRow: { flexDirection: "row", gap: 8, marginTop: 6 },
    badge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
    section: { marginTop: 16, paddingTop: 16, borderTopWidth: 1, borderTopColor: "transparent" },
    sectionTitle: { fontSize: 12, fontWeight: "700", letterSpacing: 1, marginBottom: 10 },
    infoCard: { borderRadius: 12, padding: 12 },
    infoRow: { flexDirection: "row", alignItems: "center", paddingVertical: 8 },
    noData: { fontSize: 14, padding: 4 },
    textInput: { borderWidth: 1, borderRadius: 12, padding: 12, minHeight: 100, textAlignVertical: "top", fontSize: 14 },
});
