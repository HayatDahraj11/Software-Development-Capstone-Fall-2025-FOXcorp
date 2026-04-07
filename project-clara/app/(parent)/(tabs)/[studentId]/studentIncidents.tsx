// parent view of their child's incident reports
// shows each incident with severity color coding and description
import { useLocalSearchParams } from "expo-router";
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { useThemeColor } from "@/src/features/app-themes/logic/use-theme-color";
import { useParentLoginContext } from "@/src/features/context/ParentLoginContext";
import { useParentIncidents } from "@/src/features/incidents/logic/useParentIncidents";

const SEVERITY_CONFIG: Record<string, { color: string; bg: string; icon: string }> = {
    Low: { color: "#16a34a", bg: "#22c55e20", icon: "information-circle" },
    Medium: { color: "#d97706", bg: "#f59e0b20", icon: "alert-circle" },
    High: { color: "#dc2626", bg: "#ef444420", icon: "warning" },
    Critical: { color: "#7c3aed", bg: "#7c3aed20", icon: "flame" },
};

export default function StudentIncidentsScreen() {
    const { studentId } = useLocalSearchParams<{ studentId: string }>();
    const { userStudents, userClasses } = useParentLoginContext();
    const { incidents, isLoading, error } = useParentIncidents(studentId);

    const student = userStudents.find((s) => s.id === studentId);

    const bg = useThemeColor({}, "background");
    const cardBg = useThemeColor({}, "cardBackground");
    const textColor = useThemeColor({}, "text");
    const subtextColor = useThemeColor({}, "placeholderText");
    const tint = useThemeColor({}, "tint");

    const getClassName = (classId?: string | null): string => {
        if (!classId) return "";
        return userClasses.find((c) => c.id === classId)?.name ?? "";
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
                    {student?.firstName}'s Incidents
                </Text>
                <Text style={[styles.subtitle, { color: subtextColor }]}>
                    {incidents.length} {incidents.length === 1 ? "report" : "reports"}
                </Text>
            </View>

            {error && (
                <Text style={[styles.errorText, { color: "#dc2626" }]}>{error}</Text>
            )}

            {incidents.length === 0 && !error ? (
                <View style={[styles.center, { flex: 1 }]}>
                    <Ionicons name="shield-checkmark-outline" size={48} color="#16a34a" />
                    <Text style={[styles.emptyTitle, { color: textColor }]}>
                        No incidents reported
                    </Text>
                    <Text style={[styles.emptySubtext, { color: subtextColor }]}>
                        All clear for {student?.firstName}
                    </Text>
                </View>
            ) : (
                <FlatList
                    data={incidents}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={styles.list}
                    renderItem={({ item }) => {
                        const config = SEVERITY_CONFIG[item.severity] ?? SEVERITY_CONFIG.Low;
                        const className = getClassName(item.classId);
                        return (
                            <View style={[styles.card, { backgroundColor: cardBg }]}>
                                <View style={styles.cardHeader}>
                                    <View style={[styles.severityIcon, { backgroundColor: config.bg }]}>
                                        <Ionicons name={config.icon as any} size={20} color={config.color} />
                                    </View>
                                    <View style={styles.cardHeaderText}>
                                        <Text style={[styles.dateLabel, { color: textColor }]}>
                                            {formatDate(item.date)}
                                        </Text>
                                        {className ? (
                                            <Text style={[styles.classLabel, { color: subtextColor }]}>
                                                {className}
                                            </Text>
                                        ) : null}
                                    </View>
                                    <View style={[styles.severityBadge, { backgroundColor: config.bg }]}>
                                        <Text style={[styles.severityText, { color: config.color }]}>
                                            {item.severity}
                                        </Text>
                                    </View>
                                </View>
                                <Text style={[styles.description, { color: subtextColor }]}>
                                    {item.description}
                                </Text>
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
    emptyTitle: { fontSize: 18, fontWeight: "600", marginTop: 16 },
    emptySubtext: { fontSize: 14, marginTop: 4 },
    list: { padding: 16, paddingBottom: 80 },
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
    cardHeader: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 10,
    },
    severityIcon: {
        width: 40,
        height: 40,
        borderRadius: 12,
        alignItems: "center",
        justifyContent: "center",
    },
    cardHeaderText: { flex: 1, marginLeft: 12 },
    dateLabel: { fontSize: 15, fontWeight: "600" },
    classLabel: { fontSize: 13, marginTop: 2 },
    severityBadge: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 8,
    },
    severityText: { fontSize: 13, fontWeight: "700" },
    description: { fontSize: 14, lineHeight: 20, marginLeft: 52 },
});
