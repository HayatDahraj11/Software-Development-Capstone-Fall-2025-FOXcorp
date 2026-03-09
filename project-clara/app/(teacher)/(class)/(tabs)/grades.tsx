import { FlatList, StyleSheet, Text, View } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import { useThemeColor } from "@/src/features/app-themes/logic/use-theme-color";
import { useTeacherLoginContext } from "@/src/features/context/TeacherLoginContext";

export default function GradesScreen() {
    const { classId } = useLocalSearchParams();
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
        .map((enrollment) => {
            const student = enrollment?.student;
            if (!student) return null;
            return {
                id: student.id,
                name: `${student.firstName} ${student.lastName}`,
                grade: enrollment.currentGrade ?? null,
            };
        })
        .filter(Boolean) as { id: string; name: string; grade: number | null }[];

    return (
        <View style={[styles.container, { backgroundColor: bg }]}>
            <FlatList
                data={students}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.listContent}
                ListHeaderComponent={
                    <Text style={[styles.sectionLabel, { color: subtextColor }]}>
                        {selectedClass ? `${selectedClass.name} - GRADES` : "GRADES"}
                    </Text>
                }
                ListEmptyComponent={
                    <View style={styles.empty}>
                        <Text style={{ color: subtextColor, fontSize: 16 }}>No students found</Text>
                    </View>
                }
                renderItem={({ item }) => {
                    const gradeDisplay = item.grade != null ? Math.round(item.grade) : null;
                    return (
                        <View style={[styles.card, { backgroundColor: cardBg }]}>
                            <View style={styles.cardRow}>
                                <View style={[styles.iconBox, { backgroundColor: tint + "20" }]}>
                                    <Ionicons name="person" size={22} color={tint} />
                                </View>
                                <View style={styles.cardContent}>
                                    <Text style={[styles.studentName, { color: textColor }]}>{item.name}</Text>
                                </View>
                                {gradeDisplay != null ? (
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
                                ) : (
                                    <View style={[styles.badge, { backgroundColor: subtextColor + "20" }]}>
                                        <Text style={[styles.badgeText, { color: subtextColor }]}>N/A</Text>
                                    </View>
                                )}
                            </View>
                        </View>
                    );
                }}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    listContent: { padding: 20, paddingBottom: 40 },
    sectionLabel: { fontSize: 12, fontWeight: "700", letterSpacing: 1, marginBottom: 10, marginLeft: 4 },
    empty: { alignItems: "center", paddingTop: 40 },
    card: { borderRadius: 14, padding: 16, marginBottom: 10, shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 4, elevation: 2 },
    cardRow: { flexDirection: "row", alignItems: "center", gap: 14 },
    iconBox: { width: 44, height: 44, borderRadius: 12, alignItems: "center", justifyContent: "center" },
    cardContent: { flex: 1 },
    studentName: { fontSize: 16, fontWeight: "600" },
    badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
    badgeText: { fontSize: 13, fontWeight: "700" },
});
