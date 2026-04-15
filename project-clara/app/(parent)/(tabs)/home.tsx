import { usePushNotifications } from "@/src/features/notifications/logic/usePushNotifications";
import { Ionicons } from "@expo/vector-icons";
import { Href, useRouter } from "expo-router";
import { Pressable, ScrollView, Text, View } from "react-native";

import {
    containerStyle,
    homeScreenHeroStyle,
    quickActionStyle,
} from "@/src/features/app-themes/constants/stylesheets";
import { useThemeColor } from "@/src/features/app-themes/logic/use-theme-color";
import Card from "@/src/features/cards/ui/Card";
import AskClaraButton from "@/src/features/clara/ui/AskClaraButton";
import { useParentLoginContext } from "@/src/features/context/ParentLoginContext";
import { useDashboardData } from "@/src/features/dashboard/logic/useDashboardData";

export default function ParentHomeScreen() {
    const { userParent, userStudents, setChosenStudentId } = useParentLoginContext();
    const { expoPushToken } = usePushNotifications(userParent.userId, "PARENT");
    const router = useRouter();
    const { latestConversation, messageCount, medicalAlert, recentAbsences, incidentCount } =
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
        <View style={[containerStyle.container, { backgroundColor: bg }]}>
            <ScrollView contentContainerStyle={containerStyle.scrollContent} showsVerticalScrollIndicator={false} scrollEnabled={false}>

                {/* Hero Welcome Section */}
                <View style={homeScreenHeroStyle.heroSection}>
                    <View style={homeScreenHeroStyle.heroTop}>
                        <View>
                            <Text style={[homeScreenHeroStyle.greeting, { color: textColor }]}>
                                Welcome back,
                            </Text>
                            <Text style={[homeScreenHeroStyle.userName, { color: textColor }]}>
                                {userParent.firstName}
                            </Text>
                        </View>
                        <View style={[homeScreenHeroStyle.avatarCircle, { backgroundColor: tint }]}>
                            <Text style={homeScreenHeroStyle.avatarText}>
                                {userParent.firstName?.[0]}{userParent.lastName?.[0]}
                            </Text>
                        </View>
                    </View>
                    <Text style={[homeScreenHeroStyle.dateText, { color: subtextColor }]}>{today}</Text>
                </View>

                {/* Quick Actions Row */}
                <View style={quickActionStyle.quickActionsContainer}>
                    <Pressable
                        style={[quickActionStyle.quickActionBtn, { backgroundColor: cardBg }]}
                        onPress={() => router.push("/(parent)/(tabs)/messaging" as Href)}
                    >
                        <Ionicons name="chatbubbles" size={22} color={tint} />
                        <Text style={[quickActionStyle.quickActionLabel, { color: textColor }]}>Messages</Text>
                    </Pressable>
                    <Pressable
                        style={[quickActionStyle.quickActionBtn, { backgroundColor: cardBg }]}
                        onPress={() => router.push("/(parent)/(tabs)/general-info" as Href)}
                    >
                        <Ionicons name="people" size={22} color={tint} />
                        <Text style={[quickActionStyle.quickActionLabel, { color: textColor }]}>Students</Text>
                    </Pressable>
                    <Pressable
                        style={[quickActionStyle.quickActionBtn, { backgroundColor: cardBg }]}
                        onPress={() => router.push("/(parent)/(tabs)/live-updates" as Href)}
                    >
                        <Ionicons name="pulse" size={22} color={tint} />
                        <Text style={[quickActionStyle.quickActionLabel, { color: textColor }]}>Live</Text>
                    </Pressable>
                </View>

                {/* Section Label */}
                <Text style={[containerStyle.sectionLabel, { color: subtextColor }]}>YOUR CHILDREN</Text>

                {/* Student Cards */}
                <View style={[{maxHeight: '30%'}]}>
                    <ScrollView contentContainerStyle={{paddingHorizontal: 2}} scrollEnabled={true} showsVerticalScrollIndicator={true} >
                        {userStudents.map((student) => {
                            const attendance = student.attendanceRate != null
                            ? Math.round(student.attendanceRate)
                            : null;

                            return (
                                <Card 
                                    key={student.id}
                                    header={`${student.firstName} ${student.lastName}`}
                                    preview={student.gradeLevel!=null ? `Grade ${student.gradeLevel}` : ``}
                                    onPress={() => {
                                        setChosenStudentId(student.id); // save this so the general-info screen knows which kid it is supposed to be looking at
                                        router.push("/(parent)/(tabs)/general-info" as Href);
                                    }}
                                    urgent={true}
                                    pressable={true}
                                    icon={{name: "person", size: 24, color: tint, backgroundColor: (tint+20)}}
                                    badge={
                                        attendance!=null ? {
                                            type: 0, 
                                            content: `${attendance}%`, 
                                            contentColor: attendance >= 90 ? "#16a34a" : attendance >= 75 ? "#d97706" : "#dc2626",
                                            backgroundColor: attendance >= 90 ? "#22c55e20" : attendance >= 75 ? "#f59e0b20" : "#ef444420"
                                            } : { 
                                            type: 0,
                                            content: "100%",
                                            contentColor: "#16a34a",
                                            backgroundColor: "#22c55e20",
                                            }
                                        }
                                />
                            );
                        })}
                    </ScrollView>
                </View>
                

                {/* Clara AI entry point, prominent above Updates so parents
                    discover it immediately on first launch */}
                <Text style={[containerStyle.sectionLabel, { color: subtextColor }]}>ASSISTANT</Text>
                <AskClaraButton />

                {/* Section Label */}
                <Text style={[containerStyle.sectionLabel, { color: subtextColor }]}>UPDATES</Text>

                {/* Messages Card */}
                <Card 
                    header={"Messages"}
                    preview={latestConversation 
                        ? `${latestConversation.teacherName}: ${latestConversation.lastMessageText}`
                        : "No messages yet."
                    }
                    onPress={() => router.push("/(parent)/(tabs)/messaging" as Href)}
                    urgent={latestConversation ? true : false}
                    pressable={true}
                    icon={{name: "chatbubble-ellipses", size: 22, color: "#3b82f6", backgroundColor: "#3b82f620"}}
                    badge={messageCount > 0 
                        ? {type: 1, content: messageCount.toString(), contentColor: "#fff", backgroundColor: "#3b82f6"}
                        : undefined
                    }
                />

                {/* Medical Card */}
                <Card 
                    header={"Medical"}
                    preview={medicalAlert ? `Allergies: ${medicalAlert}` : "All clear!"}
                    onPress={() => router.push("/(parent)/(tabs)/general-info" as Href)}
                    urgent={false}
                    pressable={true}
                    icon={{name: (medicalAlert ? "warning" : "shield-checkmark"), size: 22, color: (medicalAlert ? "#dc2626" : "#16a34a"), backgroundColor: (medicalAlert ? "#ef444420" : "#22c55e20")}}
                />

                {/* Attendance Card */}
                <Card
                    header={"Attendance"}
                    preview={recentAbsences > 0
                        ? `${recentAbsences} ${recentAbsences === 1 ? "absence" : "absences"} this week`
                        : "No absences this week"
                    }
                    onPress={() => router.push("/(parent)/(tabs)/general-info" as Href)}
                    urgent={recentAbsences > 0}
                    pressable={true}
                    icon={{name: (recentAbsences > 0 ? "alert-circle" : "checkmark-circle"), size: 22, color: (recentAbsences > 0 ? "#d97706" : "#16a34a"), backgroundColor: (recentAbsences > 0 ? "#f59e0b20" : "#22c55e20")}}
                />

                {/* Incidents Card */}
                {incidentCount > 0 && (
                    <Card
                        header={"Incidents"}
                        preview={`${incidentCount} ${incidentCount === 1 ? "report" : "reports"} on file`}
                        onPress={() => router.push("/(parent)/(tabs)/general-info" as Href)}
                        urgent={true}
                        pressable={true}
                        icon={{name: "warning", size: 22, color: "#dc2626", backgroundColor: "#ef444420"}}
                    />
                )}

                {/* Announcements Card */}
                <Card
                    header={"Announcements"}
                    preview={"View class announcements"}
                    onPress={() => router.push("/(parent)/(tabs)/live-updates" as Href)}
                    urgent={false}
                    pressable={true}
                    icon={{name: "megaphone", size: 22, color: "#8b5cf6", backgroundColor: "#8b5cf620"}}
                />

            </ScrollView>
        </View>
    );
}
