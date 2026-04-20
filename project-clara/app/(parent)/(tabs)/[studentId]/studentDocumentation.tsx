import { Href, useLocalSearchParams, useRouter } from "expo-router";
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import { useThemeColor } from "@/src/features/app-themes/logic/use-theme-color";
import Card from "@/src/features/cards/ui/Card";
import { useParentLoginContext } from "@/src/features/context/ParentLoginContext";
import { useMedicalRecord } from "@/src/features/medical-records/logic/useMedicalRecord";
import { useTeacherNotes } from "@/src/features/teacher-notes/logic/useTeacherNotes";
import { Ionicons } from "@expo/vector-icons";

export default function StudentDocumentationScreen() {
    const { userStudents } = useParentLoginContext();
    const { studentId } = useLocalSearchParams<{ studentId: string }>();
    const student = userStudents.find(item => item.id === studentId);
    const router = useRouter();

    const bg = useThemeColor({}, "background");
    const cardBg = useThemeColor({}, "cardBackground");
    const textColor = useThemeColor({}, "text");
    const subtextColor = useThemeColor({}, "placeholderText");
    const tintColor = useThemeColor({}, "tint");
    const urgentColor = useThemeColor({}, "urgent");

    const { record, isLoading } = useMedicalRecord(studentId);
    const { notes, isLoading: notesLoading } = useTeacherNotes(studentId);

    if (isLoading) {
        return (
            <View style={[styles.container, styles.center, {backgroundColor: bg}]}>
                <ActivityIndicator size="large" color={tintColor} />
            </View>
        );
    }

    const hasEmergencyNotes = !!record?.emergencyNotes;
    const hasAllergies = !!record?.allergies;
    const hasMedications = !!record?.medications;
    const hasConditions = !!record?.conditions;
    const hasMedicalInfo = hasAllergies || hasMedications || hasConditions;

    return (
        <View style={[styles.container, {backgroundColor: bg}]}>
            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {/* Section: Quick Links */}
                <Text style={[styles.sectionLabel, {color: subtextColor}]}>
                    {student ? `${student.firstName}'s RECORDS` : "STUDENT RECORDS"}
                </Text>

                <Card
                    header="Behavioral Reports"
                    preview="View incident and behavioral reports"
                    onPress={() => router.push(`/(parent)/(tabs)/${studentId}/studentIncidents` as Href)}
                    pressable={true}
                    urgent={false}
                    icon={{name: "alert-circle", size: 22, color: "#d97706", backgroundColor: "#f59e0b20"}}
                />

                <Card
                    header="Attendance History"
                    preview="View daily attendance records"
                    onPress={() => router.push(`/(parent)/(tabs)/${studentId}/studentAttendance` as Href)}
                    pressable={true}
                    urgent={false}
                    icon={{name: "calendar", size: 22, color: "#3b82f6", backgroundColor: "#3b82f620"}}
                />

                <Card
                    header="Medical Records"
                    preview={hasMedicalInfo ? "View allergies, medications, conditions" : "No medical records on file"}
                    onPress={() => router.push(`/(parent)/(tabs)/${studentId}/studentMedical` as Href)}
                    pressable={true}
                    urgent={hasAllergies}
                    badge={{type: 0, content: "!", contentColor: "#fff", backgroundColor: urgentColor}}
                    icon={{name: "medkit", size: 22, color: "#dc2626", backgroundColor: "#ef444420"}}
                />

                <Card
                    header="Class Schedule"
                    preview="View class times and days"
                    onPress={() => router.push(`/(parent)/(tabs)/${studentId}/studentSchedule` as Href)}
                    pressable={true}
                    urgent={false}
                    icon={{name: "calendar-outline", size: 22, color: "#0ea5e9", backgroundColor: "#0ea5e920"}}
                />

                {/* Section: Medical Details — tap to edit */}
                <View style={{flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: 16}}>
                    <Text style={[styles.sectionLabel, {color: subtextColor, marginBottom: 0}]}>DETAILS</Text>
                    <Pressable onPress={() => router.push(`/(parent)/(tabs)/${studentId}/studentMedical` as Href)}>
                        <Text style={{fontSize: 12, fontWeight: "600", color: tintColor}}>Edit All</Text>
                    </Pressable>
                </View>

                <Pressable style={[styles.detailCard, {backgroundColor: cardBg}]} onPress={() => router.push(`/(parent)/(tabs)/${studentId}/studentMedical` as Href)}>
                    <View style={styles.detailHeader}>
                        <View style={[styles.iconBox, {backgroundColor: "#ef444420"}]}>
                            <Ionicons name="call" size={18} color="#dc2626" />
                        </View>
                        <Text style={[styles.detailTitle, {color: textColor}]}>Emergency Notes</Text>
                        <Ionicons name="pencil" size={14} color={subtextColor} />
                    </View>
                    {hasEmergencyNotes ? (
                        <Text style={[styles.detailBody, {color: textColor}]}>{record!.emergencyNotes}</Text>
                    ) : (
                        <Text style={[styles.detailBody, {color: subtextColor}]}>No emergency notes on file</Text>
                    )}
                </Pressable>

                <Pressable style={[styles.detailCard, {backgroundColor: cardBg}]} onPress={() => router.push(`/(parent)/(tabs)/${studentId}/studentMedical` as Href)}>
                    <View style={styles.detailHeader}>
                        <View style={[styles.iconBox, {backgroundColor: "#f59e0b20"}]}>
                            <Ionicons name="warning" size={18} color="#d97706" />
                        </View>
                        <Text style={[styles.detailTitle, {color: textColor}]}>Allergies</Text>
                        <Ionicons name="pencil" size={14} color={subtextColor} />
                    </View>
                    {hasAllergies ? (
                        <Text style={[styles.detailBody, {color: textColor}]}>{record!.allergies}</Text>
                    ) : (
                        <Text style={[styles.detailBody, {color: subtextColor}]}>No known allergies</Text>
                    )}
                </Pressable>

                <Pressable style={[styles.detailCard, {backgroundColor: cardBg}]} onPress={() => router.push(`/(parent)/(tabs)/${studentId}/studentMedical` as Href)}>
                    <View style={styles.detailHeader}>
                        <View style={[styles.iconBox, {backgroundColor: "#3b82f620"}]}>
                            <Ionicons name="fitness" size={18} color="#3b82f6" />
                        </View>
                        <Text style={[styles.detailTitle, {color: textColor}]}>Conditions & Accommodations</Text>
                        <Ionicons name="pencil" size={14} color={subtextColor} />
                    </View>
                    {hasConditions ? (
                        <Text style={[styles.detailBody, {color: textColor}]}>{record!.conditions}</Text>
                    ) : (
                        <Text style={[styles.detailBody, {color: subtextColor}]}>None on file</Text>
                    )}
                </Pressable>

                <Pressable style={[styles.detailCard, {backgroundColor: cardBg}]} onPress={() => router.push(`/(parent)/(tabs)/${studentId}/studentMedical` as Href)}>
                    <View style={styles.detailHeader}>
                        <View style={[styles.iconBox, {backgroundColor: "#8b5cf620"}]}>
                            <Ionicons name="medical" size={18} color="#8b5cf6" />
                        </View>
                        <Text style={[styles.detailTitle, {color: textColor}]}>Medications</Text>
                        <Ionicons name="pencil" size={14} color={subtextColor} />
                    </View>
                    {hasMedications ? (
                        <Text style={[styles.detailBody, {color: textColor}]}>{record!.medications}</Text>
                    ) : (
                        <Text style={[styles.detailBody, {color: subtextColor}]}>No medications on file</Text>
                    )}
                </Pressable>

                {/* Teacher Notes — read only for parents */}
                <Text style={[styles.sectionLabel, {color: subtextColor, marginTop: 16}]}>TEACHER NOTES</Text>

                {notesLoading ? (
                    <ActivityIndicator size="small" color={tintColor} style={{ marginVertical: 12 }} />
                ) : notes.length === 0 ? (
                    <View style={[styles.detailCard, {backgroundColor: cardBg}]}>
                        <Text style={[styles.detailBody, {color: subtextColor, marginLeft: 0}]}>No teacher notes for this student</Text>
                    </View>
                ) : (
                    notes.map((note) => {
                        const catColors: Record<string, { color: string; bg: string; icon: string }> = {
                            GENERAL: { color: "#6b7280", bg: "#6b728020", icon: "chatbox" },
                            ACADEMIC: { color: "#3b82f6", bg: "#3b82f620", icon: "school" },
                            BEHAVIORAL: { color: "#f59e0b", bg: "#f59e0b20", icon: "alert-circle" },
                            POSITIVE: { color: "#22c55e", bg: "#22c55e20", icon: "star" },
                        };
                        const cat = catColors[note.category ?? "GENERAL"] ?? catColors.GENERAL;
                        const dateStr = new Date(note.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

                        return (
                            <View key={note.id} style={[styles.detailCard, {backgroundColor: cardBg}]}>
                                <View style={styles.detailHeader}>
                                    <View style={[styles.iconBox, {backgroundColor: cat.bg}]}>
                                        <Ionicons name={cat.icon as any} size={18} color={cat.color} />
                                    </View>
                                    <View style={{flex: 1}}>
                                        <Text style={[styles.detailTitle, {color: textColor}]}>{note.title || (note.category === "ACADEMIC" ? "Academic Note" : "Teacher Note")}</Text>
                                        <Text style={{fontSize: 11, color: subtextColor}}>{dateStr}</Text>
                                    </View>
                                    <View style={[styles.catTag, {backgroundColor: cat.bg}]}>
                                        <Text style={{fontSize: 10, fontWeight: "700", color: cat.color}}>{note.category ?? "GENERAL"}</Text>
                                    </View>
                                </View>
                                <Text style={[styles.detailBody, {color: textColor}]}>{note.body}</Text>
                            </View>
                        );
                    })
                )}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    center: {
        justifyContent: "center",
        alignItems: "center",
    },
    scrollContent: {
        padding: 20,
        paddingBottom: 40,
    },
    sectionLabel: {
        fontSize: 12,
        fontWeight: "700",
        letterSpacing: 1,
        marginBottom: 10,
        marginLeft: 4,
    },
    detailCard: {
        borderRadius: 14,
        padding: 16,
        marginBottom: 10,
    },
    detailHeader: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
        marginBottom: 10,
    },
    iconBox: {
        width: 32,
        height: 32,
        borderRadius: 8,
        alignItems: "center",
        justifyContent: "center",
    },
    detailTitle: {
        fontSize: 15,
        fontWeight: "600",
    },
    detailBody: {
        fontSize: 14,
        lineHeight: 20,
        marginLeft: 42,
    },
    catTag: {
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
    },
});
