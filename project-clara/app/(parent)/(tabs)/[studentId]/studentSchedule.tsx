import { useLocalSearchParams } from "expo-router";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { useThemeColor } from "@/src/features/app-themes/logic/use-theme-color";
import { useParentLoginContext } from "@/src/features/context/ParentLoginContext";

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

    const student = userStudents.find((s) => s.id === studentId);
    const classIds = getClassesMappedByStudent(studentId);

    const scheduleRows = classIds
        .map((classId) => {
            const cls = userClasses.find((c) => c.id === classId);
            if (!cls) return null;
            const teacherName = getTeacherNamebyId(cls.teacherId);
            const grade = getStudentGradeInClass(studentId, classId);
            return { classId, className: cls.name, teacherName, grade };
        })
        .filter(Boolean) as { classId: string; className: string; teacherName: string; grade: number }[];

    return (
        <View style={[styles.container, { backgroundColor: bg }]}>
            <ScrollView contentContainerStyle={styles.content}>
                <Text style={[styles.sectionLabel, { color: subtextColor }]}>
                    {student ? `${student.firstName}'s CLASSES` : "CLASS SCHEDULE"}
                </Text>

                {scheduleRows.length === 0 ? (
                    <View style={styles.empty}>
                        <Text style={{ color: subtextColor, fontSize: 16 }}>No classes found</Text>
                    </View>
                ) : (
                    scheduleRows.map((row, index) => {
                        const gradeDisplay = row.grade != null ? Math.round(row.grade) : null;
                        return (
                            <View key={row.classId} style={[styles.card, { backgroundColor: cardBg }]}>
                                <View style={styles.cardRow}>
                                    <View style={[styles.iconBox, { backgroundColor: tint + "20" }]}>
                                        <Ionicons name="book" size={22} color={tint} />
                                    </View>
                                    <View style={styles.cardContent}>
                                        <Text style={[styles.className, { color: textColor }]}>{row.className}</Text>
                                        <Text style={[styles.teacherName, { color: subtextColor }]}>{row.teacherName}</Text>
                                    </View>
                                    {gradeDisplay != null && (
                                        <View style={[
                                            styles.badge,
                                            { backgroundColor: gradeDisplay >= 90 ? "#22c55e20" : gradeDisplay >= 70 ? "#f59e0b20" : "#ef444420" },
                                        ]}>
                                            <Text style={[
                                                styles.badgeText,
                                                { color: gradeDisplay >= 90 ? "#16a34a" : gradeDisplay >= 70 ? "#d97706" : "#dc2626" },
                                            ]}>
                                                {gradeDisplay}%
                                            </Text>
                                        </View>
                                    )}
                                </View>
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
    sectionLabel: { fontSize: 12, fontWeight: "700", letterSpacing: 1, marginBottom: 10, marginLeft: 4 },
    empty: { alignItems: "center", paddingTop: 40 },
    card: { borderRadius: 14, padding: 16, marginBottom: 10, shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 4, elevation: 2 },
    cardRow: { flexDirection: "row", alignItems: "center", gap: 14 },
    iconBox: { width: 44, height: 44, borderRadius: 12, alignItems: "center", justifyContent: "center" },
    cardContent: { flex: 1 },
    className: { fontSize: 16, fontWeight: "600" },
    teacherName: { fontSize: 13, marginTop: 2 },
    badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
    badgeText: { fontSize: 13, fontWeight: "700" },
});
