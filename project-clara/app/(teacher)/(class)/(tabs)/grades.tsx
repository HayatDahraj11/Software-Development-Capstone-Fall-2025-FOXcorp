import { Dimensions, FlatList, StyleSheet, Text, View } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { BarChart } from "react-native-chart-kit";

import { useThemeColor } from "@/src/features/app-themes/logic/use-theme-color";
import { useTeacherLoginContext } from "@/src/features/context/TeacherLoginContext";

const screenWidth = Dimensions.get("window").width;

// figure out which letter grade bucket a numeric grade falls into
function getLetterGrade(grade: number): string {
  if (grade >= 90) return "A";
  if (grade >= 80) return "B";
  if (grade >= 70) return "C";
  if (grade >= 60) return "D";
  return "F";
}

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

  // only count students who actually have a grade for stats
  const gradedStudents = students.filter((s) => s.grade != null);
  const hasGrades = gradedStudents.length > 0;

  // class average across all graded students
  const classAverage = hasGrades
    ? Math.round(
        gradedStudents.reduce((sum, s) => sum + (s.grade ?? 0), 0) /
          gradedStudents.length
      )
    : 0;

  // count how many students fall in each letter grade range
  const countA = gradedStudents.filter((s) => (s.grade ?? 0) >= 90).length;
  const countB = gradedStudents.filter((s) => (s.grade ?? 0) >= 80 && (s.grade ?? 0) < 90).length;
  const countC = gradedStudents.filter((s) => (s.grade ?? 0) >= 70 && (s.grade ?? 0) < 80).length;
  const countD = gradedStudents.filter((s) => (s.grade ?? 0) >= 60 && (s.grade ?? 0) < 70).length;
  const countF = gradedStudents.filter((s) => (s.grade ?? 0) < 60).length;

  // build the header that shows summary stats and the chart
  const renderHeader = () => (
    <View>
      {/* page title and student count */}
      <View style={styles.headerSection}>
        <Text style={[styles.title, { color: textColor }]}>Grades</Text>
        <View style={[styles.countBadge, { backgroundColor: tint + "18" }]}>
          <Text style={[styles.countText, { color: tint }]}>
            {students.length} {students.length === 1 ? "Student" : "Students"}
          </Text>
        </View>
      </View>

      {/* class average hero card */}
      {hasGrades && (
        <View style={[styles.averageCard, { backgroundColor: cardBg }]}>
          <View style={styles.averageRow}>
            <View>
              <Text style={[styles.averageLabel, { color: subtextColor }]}>
                Class Average
              </Text>
              <View style={styles.averageValueRow}>
                <Text
                  style={[
                    styles.averageNumber,
                    {
                      color:
                        classAverage >= 90
                          ? "#16a34a"
                          : classAverage >= 70
                          ? "#d97706"
                          : "#dc2626",
                    },
                  ]}
                >
                  {classAverage}%
                </Text>
                <View
                  style={[
                    styles.letterBadge,
                    {
                      backgroundColor:
                        classAverage >= 90
                          ? "#22c55e20"
                          : classAverage >= 70
                          ? "#f59e0b20"
                          : "#ef444420",
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.letterBadgeText,
                      {
                        color:
                          classAverage >= 90
                            ? "#16a34a"
                            : classAverage >= 70
                            ? "#d97706"
                            : "#dc2626",
                      },
                    ]}
                  >
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

      {/* grade distribution bar chart */}
      {hasGrades && (
        <View style={[styles.chartCard, { backgroundColor: cardBg }]}>
          <Text style={[styles.chartTitle, { color: textColor }]}>
            Grade Distribution
          </Text>
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
              color: (opacity = 1) => tint,
              labelColor: (opacity = 1) => textColor,
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

      {/* section label for the student list */}
      <Text style={[styles.sectionLabel, { color: subtextColor }]}>
        ALL STUDENTS
      </Text>
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
            <Text style={[styles.emptyText, { color: subtextColor }]}>
              No students found
            </Text>
          </View>
        }
        renderItem={({ item }) => {
          const gradeDisplay =
            item.grade != null ? Math.round(item.grade) : null;
          const letter =
            gradeDisplay != null ? getLetterGrade(gradeDisplay) : null;

          return (
            <View style={[styles.card, { backgroundColor: cardBg }]}>
              <View style={styles.cardRow}>
                <View style={[styles.iconBox, { backgroundColor: tint + "20" }]}>
                  <Ionicons name="person" size={22} color={tint} />
                </View>
                <View style={styles.cardContent}>
                  <Text style={[styles.studentName, { color: textColor }]}>
                    {item.name}
                  </Text>
                  {letter && (
                    <Text style={[styles.letterLabel, { color: subtextColor }]}>
                      Grade: {letter}
                    </Text>
                  )}
                </View>
                {gradeDisplay != null ? (
                  <View
                    style={[
                      styles.badge,
                      {
                        backgroundColor:
                          gradeDisplay >= 90
                            ? "#22c55e20"
                            : gradeDisplay >= 70
                            ? "#f59e0b20"
                            : "#ef444420",
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.badgeText,
                        {
                          color:
                            gradeDisplay >= 90
                              ? "#16a34a"
                              : gradeDisplay >= 70
                              ? "#d97706"
                              : "#dc2626",
                        },
                      ]}
                    >
                      {gradeDisplay}%
                    </Text>
                  </View>
                ) : (
                  <View
                    style={[styles.badge, { backgroundColor: subtextColor + "20" }]}
                  >
                    <Text style={[styles.badgeText, { color: subtextColor }]}>
                      N/A
                    </Text>
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
  headerSection: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 8,
  },
  countBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 16,
  },
  countText: {
    fontSize: 13,
    fontWeight: "600",
  },
  averageCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 6,
    elevation: 3,
  },
  averageRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  averageLabel: {
    fontSize: 14,
    marginBottom: 4,
  },
  averageValueRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  averageNumber: {
    fontSize: 40,
    fontWeight: "800",
  },
  letterBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  letterBadgeText: {
    fontSize: 18,
    fontWeight: "700",
  },
  averageIcon: {
    width: 52,
    height: 52,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  chartCard: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
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
  sectionLabel: {
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 1,
    marginBottom: 10,
    marginLeft: 4,
  },
  empty: {
    alignItems: "center",
    paddingTop: 40,
    gap: 12,
  },
  emptyText: {
    fontSize: 16,
  },
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
  cardRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  cardContent: { flex: 1 },
  studentName: { fontSize: 16, fontWeight: "600" },
  letterLabel: { fontSize: 13, marginTop: 2 },
  badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  badgeText: { fontSize: 13, fontWeight: "700" },
});
