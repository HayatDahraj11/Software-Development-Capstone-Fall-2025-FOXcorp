import { useCallback, useEffect, useRef, useState } from "react";
import { ActivityIndicator, Dimensions, ScrollView, StyleSheet, Text, View } from "react-native";
import { useGlobalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { generateClient } from "aws-amplify/api";
import { PieChart } from "react-native-chart-kit";

import { useThemeColor } from "@/src/features/app-themes/logic/use-theme-color";
import { useTeacherLoginContext } from "@/src/features/context/TeacherLoginContext";
import { attendancesByClassId } from "@/src/graphql/queries";

let _client: any = null;
function getClient() {
    if (!_client) _client = generateClient();
    return _client;
}
const screenWidth = Dimensions.get("window").width;

export default function AttendanceSummaryScreen() {
  const { classId } = useGlobalSearchParams();
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

  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  const load = useCallback(async () => {
    if (!classIdString) return;
    setIsLoading(true);
    try {
      const today = new Date().toISOString().split("T")[0];
      const result: any = await getClient().graphql({
        query: attendancesByClassId,
        variables: { classId: classIdString },
        authMode: "apiKey",
      });
      const items = result?.data?.attendancesByClassId?.items ?? [];
      if (!isMounted.current) return;

      setTotalRecords(items.length);

      const todayRecords = items.filter((r: any) => r.date === today);
      setPresent(todayRecords.filter((r: any) => r.status === "PRESENT").length);
      setAbsent(todayRecords.filter((r: any) => r.status === "ABSENT").length);
      setLate(todayRecords.filter((r: any) => r.status === "LATE").length);
    } catch {
      // graceful fallback, don't crash the screen
    }
    if (isMounted.current) setIsLoading(false);
  }, [classIdString]);

  useEffect(() => {
    load();
  }, [load]);

  if (isLoading) {
    return (
      <View style={[styles.container, styles.center, { backgroundColor: bg }]}>
        <ActivityIndicator size="large" color={tint} />
      </View>
    );
  }

  const todayStr = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  const hasTodayData = present > 0 || absent > 0 || late > 0;
  const todayTotal = present + absent + late;
  // only calculate rate if we have records to avoid divide by zero
  const attendanceRate = todayTotal > 0 ? Math.round((present / todayTotal) * 100) : 0;

  // pie chart data, only used when there are attendance records today
  const pieData = [
    {
      name: "Present",
      population: present,
      color: "#22c55e",
      legendFontColor: textColor,
      legendFontSize: 13,
    },
    {
      name: "Absent",
      population: absent,
      color: "#ef4444",
      legendFontColor: textColor,
      legendFontSize: 13,
    },
    {
      name: "Late",
      population: late,
      color: "#f59e0b",
      legendFontColor: textColor,
      legendFontSize: 13,
    },
  ];

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: bg }]}
      contentContainerStyle={styles.content}
    >
      {/* title and date */}
      <Text style={[styles.title, { color: textColor }]}>Attendance Dashboard</Text>
      <Text style={[styles.dateText, { color: subtextColor }]}>{todayStr}</Text>

      {/* attendance rate hero card, only shows when there's data */}
      {hasTodayData && (
        <View style={[styles.rateCard, { backgroundColor: cardBg }]}>
          <View style={styles.rateRow}>
            <View>
              <Text style={[styles.rateLabel, { color: subtextColor }]}>
                Today's Attendance Rate
              </Text>
              <Text
                style={[
                  styles.rateValue,
                  {
                    color:
                      attendanceRate >= 90
                        ? "#16a34a"
                        : attendanceRate >= 75
                        ? "#d97706"
                        : "#dc2626",
                  },
                ]}
              >
                {attendanceRate}%
              </Text>
            </View>
            <View
              style={[
                styles.rateIcon,
                {
                  backgroundColor:
                    attendanceRate >= 90
                      ? "#22c55e18"
                      : attendanceRate >= 75
                      ? "#f59e0b18"
                      : "#ef444418",
                },
              ]}
            >
              <Ionicons
                name={attendanceRate >= 90 ? "trending-up" : attendanceRate >= 75 ? "remove" : "trending-down"}
                size={28}
                color={
                  attendanceRate >= 90
                    ? "#16a34a"
                    : attendanceRate >= 75
                    ? "#d97706"
                    : "#dc2626"
                }
              />
            </View>
          </View>
        </View>
      )}

      {/* stat cards */}
      <View style={styles.statsRow}>
        <StatCard
          icon="people"
          label="Enrolled"
          value={totalStudents}
          color={tint}
          cardBg={cardBg}
          textColor={textColor}
          subtextColor={subtextColor}
        />
        <StatCard
          icon="checkmark-circle"
          label="Present"
          value={present}
          color="#16a34a"
          cardBg={cardBg}
          textColor={textColor}
          subtextColor={subtextColor}
        />
      </View>
      <View style={styles.statsRow}>
        <StatCard
          icon="close-circle"
          label="Absent"
          value={absent}
          color="#dc2626"
          cardBg={cardBg}
          textColor={textColor}
          subtextColor={subtextColor}
        />
        <StatCard
          icon="time"
          label="Late"
          value={late}
          color="#d97706"
          cardBg={cardBg}
          textColor={textColor}
          subtextColor={subtextColor}
        />
      </View>

      {/* pie chart showing today's breakdown */}
      {hasTodayData && (
        <View style={[styles.chartCard, { backgroundColor: cardBg }]}>
          <Text style={[styles.chartTitle, { color: textColor }]}>
            Today's Breakdown
          </Text>
          <PieChart
            data={pieData}
            width={screenWidth - 40}
            height={200}
            chartConfig={{
              color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            }}
            accessor="population"
            backgroundColor="transparent"
            paddingLeft="15"
          />
        </View>
      )}

      {/* total records info */}
      <View style={[styles.infoCard, { backgroundColor: cardBg }]}>
        <Text style={[styles.infoLabel, { color: subtextColor }]}>
          Total Attendance Records
        </Text>
        <Text style={[styles.infoValue, { color: textColor }]}>{totalRecords}</Text>
      </View>

      {!hasTodayData && (
        <View style={styles.emptyState}>
          <Ionicons name="calendar-outline" size={44} color={subtextColor} />
          <Text style={[styles.noDataText, { color: subtextColor }]}>
            No attendance records for today yet
          </Text>
        </View>
      )}
    </ScrollView>
  );
}

// individual stat card with an icon, number, and label
function StatCard({
  icon,
  label,
  value,
  color,
  cardBg,
  textColor,
  subtextColor,
}: {
  icon: any;
  label: string;
  value: number;
  color: string;
  cardBg: string;
  textColor: string;
  subtextColor: string;
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
  title: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 4,
  },
  dateText: {
    fontSize: 14,
    marginBottom: 20,
  },
  rateCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 6,
    elevation: 3,
  },
  rateRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  rateLabel: {
    fontSize: 14,
    marginBottom: 4,
  },
  rateValue: {
    fontSize: 40,
    fontWeight: "800",
  },
  rateIcon: {
    width: 52,
    height: 52,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  statsRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 12,
  },
  statCard: {
    flex: 1,
    borderRadius: 14,
    padding: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  statIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  statValue: { fontSize: 28, fontWeight: "700" },
  statLabel: { fontSize: 13, marginTop: 4 },
  chartCard: {
    borderRadius: 16,
    padding: 16,
    marginTop: 8,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
    alignItems: "center",
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
    alignSelf: "flex-start",
  },
  infoCard: {
    borderRadius: 14,
    padding: 16,
    marginTop: 4,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  infoLabel: { fontSize: 14 },
  infoValue: { fontSize: 16, fontWeight: "700" },
  emptyState: {
    alignItems: "center",
    paddingTop: 32,
    gap: 12,
  },
  noDataText: {
    textAlign: "center",
    fontSize: 15,
  },
});
