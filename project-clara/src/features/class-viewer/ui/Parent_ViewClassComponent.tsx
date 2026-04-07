// popup modal displaying class info for a parent
// shows class name, grade, teacher, and recent announcements
import { useEffect, useState } from "react";
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import { Avatar, AvatarFallback, AvatarImage } from '@/src/rnreusables/ui/avatar';
import { Ionicons } from "@expo/vector-icons";
import { Announcement, fetchAnnouncementsByClass } from "../../announcements/api/announcementRepo";
import { containerStyle } from "../../app-themes/constants/stylesheets";
import { useThemeColor } from "../../app-themes/logic/use-theme-color";


type Props = {
    classId: string;
    className: string;
    teacherId: string;
    teacherName: string;
    studentGrade: number;
    onClickProfilePic: (teacherId: string) => void;
};

const PlaceholderImage = require('@/assets/images/icon.png')

function timeAgo(dateStr: string): string {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "Just now";
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    const days = Math.floor(hrs / 24);
    return `${days}d ago`;
}

export default function Parent_ViewClassComponent({classId, className, teacherId, teacherName, studentGrade, onClickProfilePic}: Props) {

    const bgcolor = useThemeColor({}, "background");
    const cardbgcolor = useThemeColor({}, "cardBackground");
    const lightbackground = useThemeColor({}, "lightContrastBackground")
    const textcolor = useThemeColor({}, "text");
    const tintcolor = useThemeColor({}, 'tint');
    const subtextcolor = useThemeColor({}, "placeholderText");

    const [announcements, setAnnouncements] = useState<Announcement[]>([]);
    const [loadingAnnouncements, setLoadingAnnouncements] = useState(true);

    useEffect(() => {
        if (!classId || classId === "broken") return;
        setLoadingAnnouncements(true);
        fetchAnnouncementsByClass(classId).then((result) => {
            if (result.data) {
                const sorted = result.data.sort(
                    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
                );
                setAnnouncements(sorted.slice(0, 3));
            }
            setLoadingAnnouncements(false);
        });
    }, [classId]);

    const gradeColor = studentGrade >= 90 ? "#16a34a" : studentGrade >= 70 ? "#d97706" : "#dc2626";
    const gradeBg = studentGrade >= 90 ? "#22c55e20" : studentGrade >= 70 ? "#f59e0b20" : "#ef444420";

    return (
        <ScrollView style={{maxHeight: 400}} showsVerticalScrollIndicator={false}>
            <View style={styles.content}>
                {/* Header with class name and grade badge */}
                <View style={styles.headerContainer}>
                    <Text style={[styles.className, {color: textcolor}]}>{className}</Text>
                    {studentGrade >= 0 && (
                        <View style={[styles.gradeBadge, {backgroundColor: gradeBg}]}>
                            <Text style={[styles.gradeText, {color: gradeColor}]}>{Math.round(studentGrade)}%</Text>
                        </View>
                    )}
                </View>

                {/* Teacher section */}
                <View style={[styles.sectionContainer, {backgroundColor: lightbackground}]}>
                    <Text style={[styles.sectionLabel, {color: subtextcolor}]}>TEACHER</Text>
                    <View style={styles.rowContainer}>
                        <View style={styles.teacherInfo}>
                            <Ionicons name="person-circle" size={20} color={tintcolor} />
                            <Text style={[styles.teacherText, {color: textcolor}]}>{teacherName}</Text>
                        </View>
                        <Pressable onPress={() => onClickProfilePic(teacherId)} style={({pressed}) => [{opacity: pressed ? 0.7 : 1}]}>
                            <Avatar alt={`${teacherName}'s Avatar`}>
                                <AvatarImage source={PlaceholderImage} />
                                <AvatarFallback>
                                    <Text>{teacherName.charAt(0)}</Text>
                                </AvatarFallback>
                            </Avatar>
                        </Pressable>
                    </View>
                </View>

                {/* Announcements section — real data */}
                <View style={[styles.sectionContainer]}>
                    <Text style={[styles.sectionLabel, {color: subtextcolor}]}>ANNOUNCEMENTS</Text>
                    {loadingAnnouncements ? (
                        <ActivityIndicator size="small" color={tintcolor} style={{paddingVertical: 12}} />
                    ) : announcements.length === 0 ? (
                        <View style={[styles.emptyState, {backgroundColor: lightbackground}]}>
                            <Ionicons name="megaphone-outline" size={20} color={subtextcolor} />
                            <Text style={[styles.emptyText, {color: subtextcolor}]}>No announcements yet</Text>
                        </View>
                    ) : (
                        announcements.map((a) => (
                            <View key={a.id} style={[styles.announcementCard, {backgroundColor: lightbackground}]}>
                                <View style={styles.announcementHeader}>
                                    <Text style={[styles.announcementTitle, {color: textcolor}]} numberOfLines={1}>{a.title}</Text>
                                    <Text style={[styles.announcementTime, {color: subtextcolor}]}>{timeAgo(a.createdAt)}</Text>
                                </View>
                                <Text style={[styles.announcementBody, {color: subtextcolor}]} numberOfLines={2}>{a.body}</Text>
                            </View>
                        ))
                    )}
                </View>
            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create ({
    content: {
        flexDirection: 'column',
    },
    rowContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    className: {
        fontSize: 18,
        fontWeight: "700",
        flex: 1,
    },
    gradeBadge: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 8,
    },
    gradeText: {
        fontSize: 15,
        fontWeight: "700",
    },
    teacherInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    teacherText: {
        fontSize: 16,
        fontWeight: "500",
    },
    sectionLabel: {
        fontSize: 11,
        fontWeight: "700",
        letterSpacing: 1,
        marginBottom: 8,
    },
    sectionContainer: {
        marginVertical: 8,
        padding: 10,
        borderRadius: 10,
        flexDirection: 'column',
    },
    emptyState: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        padding: 12,
        borderRadius: 8,
    },
    emptyText: {
        fontSize: 14,
    },
    announcementCard: {
        padding: 10,
        borderRadius: 8,
        marginBottom: 6,
    },
    announcementHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 4,
    },
    announcementTitle: {
        fontSize: 14,
        fontWeight: "600",
        flex: 1,
        marginRight: 8,
    },
    announcementTime: {
        fontSize: 11,
    },
    announcementBody: {
        fontSize: 13,
        lineHeight: 18,
    },
})
