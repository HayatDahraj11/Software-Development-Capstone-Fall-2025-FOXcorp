// teacher screen for viewing and posting class announcements
// shows past announcements grouped by date with professional card layout
// the + button opens a bottom sheet where you type a title and body to post
import { useState } from "react";
import {
    ActivityIndicator,
    Modal,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";
import { useGlobalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import { useThemeColor } from "@/src/features/app-themes/logic/use-theme-color";
import { useTeacherLoginContext } from "@/src/features/context/TeacherLoginContext";
import { useAnnouncements } from "@/src/features/announcements/logic/useAnnouncements";
import { containerStyle } from "@/src/features/app-themes/constants/stylesheets";

export default function AnnouncementsScreen() {
    const { classId } = useGlobalSearchParams();
    const { userTeacher } = useTeacherLoginContext();
    const classIdString = Array.isArray(classId) ? classId[0] : classId ?? "";

    const { announcements, isLoading, error, loadAnnouncements, createAnnouncement } =
        useAnnouncements(classIdString);

    const bg = useThemeColor({}, "background");
    const cardBg = useThemeColor({}, "cardBackground");
    const textColor = useThemeColor({}, "text");
    const subtextColor = useThemeColor({}, "placeholderText");
    const tint = useThemeColor({}, "tint");
    const borderColor = useThemeColor({}, "listBorderTranslucent");

    const [showCreate, setShowCreate] = useState(false);
    const [newTitle, setNewTitle] = useState("");
    const [newBody, setNewBody] = useState("");
    const [isSending, setIsSending] = useState(false);

    const handleCreate = async () => {
        if (!newTitle.trim() || !newBody.trim()) return;
        setIsSending(true);
        try {
            const success = await createAnnouncement(newTitle.trim(), newBody.trim(), userTeacher.userId);
            if (success) {
                setNewTitle("");
                setNewBody("");
                setShowCreate(false);
            }
        } catch (err) {
            console.error("Failed to create announcement:", err);
        } finally {
            setIsSending(false);
        }
    };

    const resetAndClose = () => {
        setShowCreate(false);
        setNewTitle("");
        setNewBody("");
    };

    // figure out how long ago an announcement was posted
    const getTimeAgo = (dateStr: string): string => {
        const now = new Date();
        const date = new Date(dateStr);
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        if (diffMins < 1) return "Just now";
        if (diffMins < 60) return `${diffMins}m ago`;
        const diffHours = Math.floor(diffMins / 60);
        if (diffHours < 24) return `${diffHours}h ago`;
        const diffDays = Math.floor(diffHours / 24);
        if (diffDays < 7) return `${diffDays}d ago`;
        return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    };

    // group announcements by date so we can show them with date dividers
    const grouped: Record<string, typeof announcements> = {};
    for (const ann of announcements) {
        const date = new Date(ann.createdAt).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
        });
        if (!grouped[date]) grouped[date] = [];
        grouped[date].push(ann);
    }

    if (isLoading && announcements.length === 0) {
        return (
            <View style={[styles.container, styles.center, { backgroundColor: bg }]}>
                <ActivityIndicator size="large" color={tint} />
            </View>
        );
    }

    return (
        <View style={[containerStyle.container, { backgroundColor: bg }]}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                {/* header section */}
                <View style={styles.headerSection}>
                    <View style={styles.headerRow}>
                        <View>
                            <Text style={[styles.screenTitle, { color: textColor }]}>Announcements</Text>
                            <Text style={[styles.headerSubtext, { color: subtextColor }]}>
                                {announcements.length} {announcements.length === 1 ? "post" : "posts"}
                            </Text>
                        </View>
                        <Pressable
                            style={[styles.newPostBtn, { backgroundColor: tint }]}
                            onPress={() => setShowCreate(true)}
                        >
                            <Ionicons name="add" size={18} color="#fff" />
                            <Text style={styles.newPostBtnText}>New Post</Text>
                        </Pressable>
                    </View>
                </View>

                {error && (
                    <View style={[styles.errorCard, { backgroundColor: "#ef444415", borderColor: "#ef444440" }]}>
                        <Ionicons name="alert-circle" size={18} color="#dc2626" />
                        <Text style={[styles.errorText, { color: "#dc2626" }]}>{error}</Text>
                        <Pressable onPress={loadAnnouncements}>
                            <Text style={{ color: tint, fontWeight: "600", fontSize: 14 }}>Retry</Text>
                        </Pressable>
                    </View>
                )}

                {announcements.length === 0 && !error ? (
                    <View style={styles.emptyState}>
                        <View style={[styles.emptyIconCircle, { backgroundColor: "#8b5cf615" }]}>
                            <Ionicons name="megaphone-outline" size={40} color="#8b5cf6" />
                        </View>
                        <Text style={[styles.emptyTitle, { color: textColor }]}>No announcements yet</Text>
                        <Text style={[styles.emptySubtext, { color: subtextColor }]}>
                            Post your first announcement to keep the class informed
                        </Text>
                    </View>
                ) : (
                    Object.keys(grouped).map((dateStr) => (
                        <View key={dateStr} style={styles.section}>
                            {/* date divider */}
                            <View style={styles.dateRow}>
                                <View style={[styles.dateLine, { backgroundColor: borderColor }]} />
                                <Text style={[styles.dateText, { color: subtextColor }]}>{dateStr}</Text>
                                <View style={[styles.dateLine, { backgroundColor: borderColor }]} />
                            </View>

                            {grouped[dateStr].map((ann) => (
                                <View key={ann.id} style={[styles.card, { backgroundColor: cardBg }]}>
                                    {/* card header row with icon, title, and time badge */}
                                    <View style={styles.cardRow}>
                                        <View style={[styles.cardIcon, { backgroundColor: "#8b5cf620" }]}>
                                            <Ionicons name="megaphone" size={20} color="#8b5cf6" />
                                        </View>
                                        <View style={styles.cardContent}>
                                            <Text style={[styles.cardTitle, { color: textColor }]}>{ann.title}</Text>
                                            <Text style={[styles.cardTime, { color: subtextColor }]}>
                                                {getTimeAgo(ann.createdAt)}
                                            </Text>
                                        </View>
                                    </View>
                                    {/* announcement body */}
                                    <Text style={[styles.cardBody, { color: subtextColor }]}>{ann.body}</Text>
                                </View>
                            ))}
                        </View>
                    ))
                )}
            </ScrollView>

            {/* Create Modal - using Modal instead of Dialog for reliable press handling */}
            <Modal
                visible={showCreate}
                animationType="slide"
                transparent
                onRequestClose={resetAndClose}
            >
                <View style={styles.overlay}>
                    <View style={[styles.sheet, { backgroundColor: bg }]}>
                        <View style={[styles.sheetHeader, { borderBottomColor: borderColor }]}>
                            <Text style={[styles.sheetTitle, { color: textColor }]}>
                                New Announcement
                            </Text>
                            <Pressable onPress={resetAndClose}>
                                <Text style={{ color: subtextColor, fontSize: 16 }}>Cancel</Text>
                            </Pressable>
                        </View>

                        <Text style={[styles.fieldLabel, { color: subtextColor }]}>TITLE</Text>
                        <TextInput
                            style={[styles.input, { backgroundColor: cardBg, color: textColor, borderColor }]}
                            placeholder="Announcement title"
                            placeholderTextColor={subtextColor}
                            value={newTitle}
                            onChangeText={setNewTitle}
                        />

                        <Text style={[styles.fieldLabel, { color: subtextColor }]}>MESSAGE</Text>
                        <TextInput
                            style={[styles.input, styles.bodyInput, { backgroundColor: cardBg, color: textColor, borderColor }]}
                            placeholder="Write your announcement..."
                            placeholderTextColor={subtextColor}
                            multiline
                            value={newBody}
                            onChangeText={setNewBody}
                        />

                        <Pressable
                            style={[
                                styles.postBtn,
                                {
                                    backgroundColor: tint,
                                    opacity: (!newTitle.trim() || !newBody.trim() || isSending) ? 0.5 : 1,
                                },
                            ]}
                            onPress={handleCreate}
                            disabled={!newTitle.trim() || !newBody.trim() || isSending}
                        >
                            <Ionicons name="megaphone" size={18} color="#fff" style={{ marginRight: 8 }} />
                            <Text style={styles.postBtnText}>
                                {isSending ? "Posting..." : "Post Announcement"}
                            </Text>
                        </Pressable>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    center: { flex: 1, alignItems: "center", justifyContent: "center", padding: 32 },
    scrollContent: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 80 },

    // header
    headerSection: { marginBottom: 20 },
    headerRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
    screenTitle: { fontSize: 24, fontWeight: "700" },
    headerSubtext: { fontSize: 14, marginTop: 2 },
    newPostBtn: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 12,
        gap: 6,
    },
    newPostBtnText: { color: "#fff", fontSize: 14, fontWeight: "600" },

    // error
    errorCard: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
        padding: 14,
        borderRadius: 12,
        borderWidth: 1,
        marginBottom: 16,
    },
    errorText: { flex: 1, fontSize: 14 },

    // empty state
    emptyState: { alignItems: "center", paddingTop: 60 },
    emptyIconCircle: {
        width: 80,
        height: 80,
        borderRadius: 40,
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 20,
    },
    emptyTitle: { fontSize: 18, fontWeight: "600", marginBottom: 8 },
    emptySubtext: { fontSize: 14, textAlign: "center", lineHeight: 20, maxWidth: 260 },

    // date grouping
    section: { marginBottom: 8 },
    dateRow: { flexDirection: "row", alignItems: "center", marginVertical: 12 },
    dateLine: { flex: 1, height: 1 },
    dateText: { marginHorizontal: 12, fontSize: 13, fontWeight: "500" },

    // announcement cards
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
        marginBottom: 10,
    },
    cardIcon: {
        width: 44,
        height: 44,
        borderRadius: 12,
        alignItems: "center",
        justifyContent: "center",
    },
    cardContent: { flex: 1 },
    cardTitle: { fontSize: 16, fontWeight: "600" },
    cardTime: { fontSize: 12, marginTop: 2 },
    cardBody: { fontSize: 14, lineHeight: 21, marginLeft: 58 },

    // modal form
    overlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.4)", justifyContent: "flex-end" },
    sheet: {
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
        padding: 20,
        paddingBottom: 40,
    },
    sheetHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingBottom: 16,
        marginBottom: 16,
        borderBottomWidth: 1,
    },
    sheetTitle: { fontSize: 18, fontWeight: "bold" },
    fieldLabel: {
        fontSize: 12,
        fontWeight: "700",
        letterSpacing: 0.5,
        marginBottom: 6,
        marginLeft: 4,
    },
    input: {
        borderWidth: 1,
        borderRadius: 12,
        padding: 12,
        fontSize: 16,
        marginBottom: 14,
    },
    bodyInput: { minHeight: 100, textAlignVertical: "top" },
    postBtn: {
        flexDirection: "row",
        borderRadius: 12,
        padding: 16,
        alignItems: "center",
        justifyContent: "center",
    },
    postBtnText: { color: "#fff", fontSize: 16, fontWeight: "700" },
});
