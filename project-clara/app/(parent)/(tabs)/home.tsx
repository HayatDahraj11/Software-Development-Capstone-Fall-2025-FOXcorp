import { usePushNotifications } from "@/src/features/notifications/logic/usePushNotifications";
import { Href, useRouter } from "expo-router";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { useThemeColor } from "@/src/features/app-themes/logic/use-theme-color";
import { useParentLoginContext } from "@/src/features/context/ParentLoginContext";
import { useDashboardData } from "@/src/features/dashboard/logic/useDashboardData";

export default function ParentHomeScreen() {
    const { expoPushToken } = usePushNotifications();
    const { userParent, userStudents } = useParentLoginContext();
    const router = useRouter();
    const { latestConversation, messageCount, medicalAlert } =
        useDashboardData(userParent.userId, userStudents);

    const today = new Date().toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
    });

    const bg = useThemeColor({}, "background");
    const cardBg = useThemeColor({}, "cardBackground");
    const textColor = useThemeColor({}, "text");
    const subtextColor = useThemeColor({}, "placeholderText");
    const tint = useThemeColor({}, "tint");
    const urgent = useThemeColor({}, "urgent");

    return (
        <View style={[styles.container, { backgroundColor: bg }]}>
            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

                {/* Hero Welcome Section */}
                <View style={styles.heroSection}>
                    <View style={styles.heroTop}>
                        <View>
                            <Text style={[styles.greeting, { color: textColor }]}>
                                Welcome back,
                            </Text>
                            <Text style={[styles.userName, { color: textColor }]}>
                                {userParent.firstName}
                            </Text>
                        </View>
                        <View style={[styles.avatarCircle, { backgroundColor: tint }]}>
                            <Text style={styles.avatarText}>
                                {userParent.firstName?.[0]}{userParent.lastName?.[0]}
                            </Text>
                        </View>
                    </View>
                    <Text style={[styles.dateText, { color: subtextColor }]}>{today}</Text>
                </View>

                {/* Quick Actions Row */}
                <View style={styles.quickActions}>
                    <Pressable
                        style={[styles.quickActionBtn, { backgroundColor: cardBg }]}
                        onPress={() => router.push("/(parent)/(tabs)/messaging" as Href)}
                    >
                        <Ionicons name="chatbubbles" size={22} color={tint} />
                        <Text style={[styles.quickActionLabel, { color: textColor }]}>Messages</Text>
                    </Pressable>
                    <Pressable
                        style={[styles.quickActionBtn, { backgroundColor: cardBg }]}
                        onPress={() => router.push("/(parent)/(tabs)/general-info" as Href)}
                    >
                        <Ionicons name="people" size={22} color={tint} />
                        <Text style={[styles.quickActionLabel, { color: textColor }]}>Students</Text>
                    </Pressable>
                    <Pressable
                        style={[styles.quickActionBtn, { backgroundColor: cardBg }]}
                        onPress={() => router.push("/(parent)/(tabs)/live-updates" as Href)}
                    >
                        <Ionicons name="pulse" size={22} color={tint} />
                        <Text style={[styles.quickActionLabel, { color: textColor }]}>Live</Text>
                    </Pressable>
                </View>

                {/* Section Label */}
                <Text style={[styles.sectionLabel, { color: subtextColor }]}>YOUR CHILDREN</Text>

                {/* Student Cards */}
                {userStudents.map((student) => {
                    const attendance = student.attendanceRate != null
                        ? Math.round(student.attendanceRate)
                        : null;

                    return (
                        <Pressable
                            key={student.id}
                            style={[styles.card, { backgroundColor: cardBg }]}
                            onPress={() => router.push("/(parent)/(tabs)/general-info" as Href)}
                        >
                            <View style={styles.cardRow}>
                                <View style={[styles.studentIcon, { backgroundColor: tint + "20" }]}>
                                    <Ionicons name="person" size={24} color={tint} />
                                </View>
                                <View style={styles.cardContent}>
                                    <Text style={[styles.cardTitle, { color: textColor }]}>
                                        {student.firstName} {student.lastName}
                                    </Text>
                                    <Text style={[styles.cardSubtitle, { color: subtextColor }]}>
                                        {student.gradeLevel != null ? `Grade ${student.gradeLevel}` : ""}
                                        {student.currentStatus ? `  •  ${student.currentStatus}` : ""}
                                    </Text>
                                </View>
                                {attendance != null && (
                                    <View style={[
                                        styles.badge,
                                        { backgroundColor: attendance >= 90 ? "#22c55e20" : attendance >= 75 ? "#f59e0b20" : "#ef444420" }
                                    ]}>
                                        <Text style={[
                                            styles.badgeText,
                                            { color: attendance >= 90 ? "#16a34a" : attendance >= 75 ? "#d97706" : "#dc2626" }
                                        ]}>
                                            {attendance}%
                                        </Text>
                                    </View>
                                )}
                                <Ionicons name="chevron-forward" size={18} color={subtextColor} />
                            </View>
                        </Pressable>
                    );
                })}

                {/* Section Label */}
                <Text style={[styles.sectionLabel, { color: subtextColor }]}>UPDATES</Text>

                {/* Messages Card */}
                <Pressable
                    style={[styles.card, { backgroundColor: cardBg }]}
                    onPress={() => router.push("/(parent)/(tabs)/messaging" as Href)}
                >
                    <View style={styles.cardRow}>
                        <View style={[styles.studentIcon, { backgroundColor: "#3b82f620" }]}>
                            <Ionicons name="chatbubble-ellipses" size={22} color="#3b82f6" />
                        </View>
                        <View style={styles.cardContent}>
                            <Text style={[styles.cardTitle, { color: textColor }]}>Messages</Text>
                            <Text style={[styles.cardSubtitle, { color: subtextColor }]} numberOfLines={1}>
                                {latestConversation
                                    ? `${latestConversation.teacherName}: ${latestConversation.lastMessageText}`
                                    : "No messages yet"}
                            </Text>
                        </View>
                        {messageCount > 0 && (
                            <View style={[styles.countBadge, { backgroundColor: "#3b82f6" }]}>
                                <Text style={styles.countBadgeText}>{messageCount}</Text>
                            </View>
                        )}
                        <Ionicons name="chevron-forward" size={18} color={subtextColor} />
                    </View>
                </Pressable>

                {/* Medical Card */}
                <Pressable
                    style={[styles.card, { backgroundColor: cardBg }]}
                    onPress={() => router.push("/(parent)/(tabs)/general-info" as Href)}
                >
                    <View style={styles.cardRow}>
                        <View style={[styles.studentIcon, { backgroundColor: medicalAlert ? "#ef444420" : "#22c55e20" }]}>
                            <Ionicons
                                name={medicalAlert ? "warning" : "shield-checkmark"}
                                size={22}
                                color={medicalAlert ? "#dc2626" : "#16a34a"}
                            />
                        </View>
                        <View style={styles.cardContent}>
                            <Text style={[styles.cardTitle, { color: textColor }]}>Medical</Text>
                            <Text style={[styles.cardSubtitle, { color: medicalAlert ? urgent : subtextColor }]} numberOfLines={1}>
                                {medicalAlert ? `Allergies: ${medicalAlert}` : "All clear"}
                            </Text>
                        </View>
                        <Ionicons name="chevron-forward" size={18} color={subtextColor} />
                    </View>
                </Pressable>

                {/* Announcements Card */}
                <Pressable style={[styles.card, { backgroundColor: cardBg }]} onPress={() => {}}>
                    <View style={styles.cardRow}>
                        <View style={[styles.studentIcon, { backgroundColor: "#8b5cf620" }]}>
                            <Ionicons name="megaphone" size={22} color="#8b5cf6" />
                        </View>
                        <View style={styles.cardContent}>
                            <Text style={[styles.cardTitle, { color: textColor }]}>Announcements</Text>
                            <Text style={[styles.cardSubtitle, { color: subtextColor }]}>Coming soon</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={18} color={subtextColor} />
                    </View>
                </Pressable>

            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollContent: {
        paddingHorizontal: 20,
        paddingTop: 16,
        paddingBottom: 40,
    },

    // Hero
    heroSection: {
        marginBottom: 24,
    },
    heroTop: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    greeting: {
        fontSize: 16,
        fontWeight: "400",
    },
    userName: {
        fontSize: 28,
        fontWeight: "700",
        marginTop: 2,
    },
    avatarCircle: {
        width: 48,
        height: 48,
        borderRadius: 24,
        alignItems: "center",
        justifyContent: "center",
    },
    avatarText: {
        color: "#fff",
        fontSize: 18,
        fontWeight: "700",
    },
    dateText: {
        fontSize: 14,
        marginTop: 6,
    },

    // Quick Actions
    quickActions: {
        flexDirection: "row",
        gap: 12,
        marginBottom: 28,
    },
    quickActionBtn: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 16,
        borderRadius: 14,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
        elevation: 2,
    },
    quickActionLabel: {
        fontSize: 12,
        fontWeight: "600",
        marginTop: 6,
    },

    // Section Labels
    sectionLabel: {
        fontSize: 12,
        fontWeight: "700",
        letterSpacing: 1,
        marginBottom: 10,
        marginLeft: 4,
    },

    // Cards
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
    studentIcon: {
        width: 44,
        height: 44,
        borderRadius: 12,
        alignItems: "center",
        justifyContent: "center",
    },
    cardContent: {
        flex: 1,
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: "600",
    },
    cardSubtitle: {
        fontSize: 13,
        marginTop: 2,
    },

    // Badges
    badge: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 8,
    },
    badgeText: {
        fontSize: 13,
        fontWeight: "700",
    },
    countBadge: {
        minWidth: 24,
        height: 24,
        borderRadius: 12,
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 6,
    },
    countBadgeText: {
        color: "#fff",
        fontSize: 12,
        fontWeight: "700",
    },
});
