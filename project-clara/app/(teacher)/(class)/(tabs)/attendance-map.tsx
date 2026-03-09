import { useCallback, useEffect, useRef, useState } from "react";
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { generateClient } from "aws-amplify/api";

import { useThemeColor } from "@/src/features/app-themes/logic/use-theme-color";
import { useTeacherLoginContext } from "@/src/features/context/TeacherLoginContext";
import { attendancesByClassId } from "@/src/graphql/queries";

const client = generateClient();

export default function AttendanceSummaryScreen() {
    const { classId } = useLocalSearchParams();
    const { userClasses } = useTeacherLoginContext();

    const bg = useThemeColor({}, "background");
    const cardBg = useThemeColor({}, "cardBackground");
    const textColor = useThemeColor({}, "text");
    const subtextColor = useThemeColor({}, "placeholderText");
    const tint = useThemeColor({}, "tint");

    const classIdString = Array.isArray(classId) ? classId[0] : classId;
    const selectedClass = userClasses.find((cls) => cls.id === classIdString);
    const totalStudents = selectedClass?.enrollments?.length ?? 0;

    const [isLoading, setIsLoading] = useState(true);
    const [present, setPresent] = useState(0);
    const [absent, setAbsent] = useState(0);
    const [late, setLate] = useState(0);
    const [totalRecords, setTotalRecords] = useState(0);
    const isMounted = useRef(true);

    useEffect(() => { return () => { isMounted.current = false; }; }, []);

    const load = useCallback(async () => {
        if (!classIdString) return;
        setIsLoading(true);
        try {
            const today = new Date().toISOString().split("T")[0];
            const result: any = await client.graphql({
                query: attendancesByClassId,
                variables: { classId: classIdString },
            });
            const items = result?.data?.attendancesByClassId?.items ?? [];
            if (!isMounted.current) return;

            setTotalRecords(items.length);

            const todayRecords = items.filter((r: any) => r.date === today);
            setPresent(todayRecords.filter((r: any) => r.status === "PRESENT").length);
            setAbsent(todayRecords.filter((r: any) => r.status === "ABSENT").length);
            setLate(todayRecords.filter((r: any) => r.status === "LATE").length);
        } catch {
            // graceful fallback
        }
        if (isMounted.current) setIsLoading(false);
    }, [classIdString]);

    useEffect(() => { load(); }, [load]);

    if (isLoading) {
        return (
            <View style={[styles.container, styles.center, { backgroundColor: bg }]}>
                <ActivityIndicator size="large" color={tint} />
            </View>
        );
    }

    const todayStr = new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });

    return (
        <ScrollView style={[styles.container, { backgroundColor: bg }]} contentContainerStyle={styles.content}>
            <Text style={[styles.sectionLabel, { color: subtextColor }]}>ATTENDANCE SUMMARY</Text>
            <Text style={[styles.dateText, { color: subtextColor }]}>{todayStr}</Text>

            <View style={styles.statsRow}>
                <StatCard icon="people" label="Enrolled" value={totalStudents} color={tint} cardBg={cardBg} textColor={textColor} subtextColor={subtextColor} />
                <StatCard icon="checkmark-circle" label="Present" value={present} color="#16a34a" cardBg={cardBg} textColor={textColor} subtextColor={subtextColor} />
            </View>
            <View style={styles.statsRow}>
                <StatCard icon="close-circle" label="Absent" value={absent} color="#dc2626" cardBg={cardBg} textColor={textColor} subtextColor={subtextColor} />
                <StatCard icon="time" label="Late" value={late} color="#d97706" cardBg={cardBg} textColor={textColor} subtextColor={subtextColor} />
            </View>

            <View style={[styles.infoCard, { backgroundColor: cardBg }]}>
                <Text style={[styles.infoLabel, { color: subtextColor }]}>Total Attendance Records</Text>
                <Text style={[styles.infoValue, { color: textColor }]}>{totalRecords}</Text>
            </View>

            {present === 0 && absent === 0 && late === 0 && (
                <Text style={[styles.noDataText, { color: subtextColor }]}>
                    No attendance records for today yet
                </Text>
            )}
        </ScrollView>
    );
}

function StatCard({ icon, label, value, color, cardBg, textColor, subtextColor }: {
    icon: any; label: string; value: number; color: string;
    cardBg: string; textColor: string; subtextColor: string;
}) {
    return (
        <View style={[styles.statCard, { backgroundColor: cardBg }]}>
            <View style={[styles.statIcon, { backgroundColor: color + "20" }]}>
                <Ionicons name={icon} size={24} color={color} />
            </View>
            <Text style={[styles.statValue, { color: textColor }]}>{value}</Text>
            <Text style={[styles.statLabel, { color: subtextColor }]}>{label}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    center: { justifyContent: "center", alignItems: "center" },
    content: { padding: 20, paddingBottom: 40 },
    sectionLabel: { fontSize: 12, fontWeight: "700", letterSpacing: 1, marginBottom: 4, marginLeft: 4 },
    dateText: { fontSize: 14, marginLeft: 4, marginBottom: 20 },
    statsRow: { flexDirection: "row", gap: 12, marginBottom: 12 },
    statCard: { flex: 1, borderRadius: 14, padding: 16, alignItems: "center", shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 4, elevation: 2 },
    statIcon: { width: 48, height: 48, borderRadius: 14, alignItems: "center", justifyContent: "center", marginBottom: 10 },
    statValue: { fontSize: 28, fontWeight: "700" },
    statLabel: { fontSize: 13, marginTop: 4 },
    infoCard: { borderRadius: 14, padding: 16, marginTop: 8, flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
    infoLabel: { fontSize: 14 },
    infoValue: { fontSize: 16, fontWeight: "700" },
    noDataText: { textAlign: "center", marginTop: 20, fontSize: 14 },
});
