// parent view of their child's attendance history
// shows each day's attendance status with color coding
import { useLocalSearchParams } from "expo-router";
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { useThemeColor } from "@/src/features/app-themes/logic/use-theme-color";
import { useParentLoginContext } from "@/src/features/context/ParentLoginContext";
import { useParentAttendance } from "@/src/features/attendance/logic/useParentAttendance";

const STATUS_CONFIG: Record<string, { label: string; icon: string; color: string; bg: string }> = {
    PRESENT: { label: "Present", icon: "checkmark-circle", color: "#16a34a", bg: "#22c55e20" },
    ABSENT: { label: "Absent", icon: "close-circle", color: "#dc2626", bg: "#ef444420" },
    LATE: { label: "Late", icon: "time", color: "#d97706", bg: "#f59e0b20" },
};

export default function StudentAttendanceScreen() {
    const { studentId } = useLocalSearchParams<{ studentId: string }>();
    const { userStudents, userClasses } = useParentLoginContext();
    const { records, isLoading, error } = useParentAttendance(studentId);

    const student = userStudents.find((s) => s.id === studentId);

    const bg = useThemeColor({}, "background");
    const cardBg = useThemeColor({}, "cardBackground");
    const textColor = useThemeColor({}, "text");
    const subtextColor = useThemeColor({}, "placeholderText");
    const tint = useThemeColor({}, "tint");

    const getClassName = (classId: string): string => {
        return userClasses.find((c) => c.id === classId)?.name ?? "Class";
    };

    const formatDate = (dateStr: string): string => {
        const date = new Date(dateStr + "T00:00:00");
        return date.toLocaleDateString("en-US", {
            weekday: "short",
            month: "short",
            day: "numeric",
        });
    };

    if (isLoading) {
        return (
            <View style={[styles.container, styles.center, { backgroundColor: bg }]}>
                <ActivityIndicator size="large" color={tint} />
            </View>
        );
    }

    return (
        <View style={[styles.container, { backgroundColor: bg }]}>
            <View style={styles.header}>
                <Text style={[styles.title, { color: textColor }]}>
                    {student?.firstName}'s Attendance
                </Text>
                <Text style={[styles.subtitle, { color: subtextColor }]}>
                    {records.length} {records.length === 1 ? "record" : "records"}
                </Text>
            </View>

            {error && (
                <Text style={[styles.errorText, { color: "#dc2626" }]}>{error}</Text>
            )}

            {records.length === 0 && !error ? (
                <View style={[styles.center, { flex: 1 }]}>
                    <Ionicons name="calendar-outline" size={48} color={subtextColor} />
                    <Text style={[styles.emptyText, { color: subtextColor }]}>
                        No attendance records yet
                    </Text>
                </View>
            ) : (
                <FlatList
                    data={records}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={styles.list}
                    renderItem={({ item }) => {
                        const config = STATUS_CONFIG[item.status] ?? STATUS_CONFIG.PRESENT;
                        return (
                            <View style={[styles.card, { backgroundColor: cardBg }]}>
                                <View style={[styles.statusIcon, { backgroundColor: config.bg }]}>
                                    <Ionicons name={config.icon as any} size={20} color={config.color} />
                                </View>
                                <View style={styles.cardContent}>
                                    <Text style={[styles.dateLabel, { color: textColor }]}>
                                        {formatDate(item.date)}
                                    </Text>
                                    <Text style={[styles.classLabel, { color: subtextColor }]}>
                                        {getClassName(item.classId)}
                                    </Text>
                                </View>
                                <View style={[styles.statusBadge, { backgroundColor: config.bg }]}>
                                    <Text style={[styles.statusText, { color: config.color }]}>
                                        {config.label}
                                    </Text>
                                </View>
                            </View>
                        );
                    }}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    center: { justifyContent: "center", alignItems: "center" },
    header: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 8 },
    title: { fontSize: 22, fontWeight: "700" },
    subtitle: { fontSize: 14, marginTop: 2 },
    errorText: { textAlign: "center", marginHorizontal: 20, marginBottom: 8 },
    emptyText: { fontSize: 16, fontWeight: "600", marginTop: 16 },
    list: { padding: 16, paddingBottom: 80 },
    card: {
        flexDirection: "row",
        alignItems: "center",
        borderRadius: 14,
        padding: 14,
        marginBottom: 8,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.06,
        shadowRadius: 4,
        elevation: 2,
    },
    statusIcon: {
        width: 40,
        height: 40,
        borderRadius: 12,
        alignItems: "center",
        justifyContent: "center",
    },
    cardContent: { flex: 1, marginLeft: 12 },
    dateLabel: { fontSize: 15, fontWeight: "600" },
    classLabel: { fontSize: 13, marginTop: 2 },
    statusBadge: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 8,
    },
    statusText: { fontSize: 13, fontWeight: "700" },
});
