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
import { useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import { useThemeColor } from "@/src/features/app-themes/logic/use-theme-color";
import { useTeacherLoginContext } from "@/src/features/context/TeacherLoginContext";
import { useAnnouncements } from "@/src/features/announcements/logic/useAnnouncements";

export default function AnnouncementsScreen() {
    const { classId } = useLocalSearchParams();
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
        const success = await createAnnouncement(newTitle.trim(), newBody.trim(), userTeacher.userId);
        setIsSending(false);
        if (success) {
            setNewTitle("");
            setNewBody("");
            setShowCreate(false);
        }
    };

    // group announcements by date
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
        <View style={[styles.container, { backgroundColor: bg }]}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                {error && (
                    <Text style={[styles.errorText, { color: "#ec5557" }]}>{error}</Text>
                )}

                {announcements.length === 0 && !error ? (
                    <View style={styles.center}>
                        <Ionicons name="megaphone-outline" size={48} color={subtextColor} />
                        <Text style={[styles.emptyText, { color: subtextColor }]}>No announcements yet</Text>
                        <Text style={[styles.emptySubtext, { color: subtextColor }]}>
                            Tap + to create one
                        </Text>
                    </View>
                ) : (
                    Object.keys(grouped).map((dateStr) => (
                        <View key={dateStr} style={styles.section}>
                            <View style={styles.dateRow}>
                                <View style={[styles.line, { backgroundColor: borderColor }]} />
                                <Text style={[styles.dateText, { color: subtextColor }]}>{dateStr}</Text>
                                <View style={[styles.line, { backgroundColor: borderColor }]} />
                            </View>

                            {grouped[dateStr].map((ann) => (
                                <View key={ann.id} style={[styles.card, { backgroundColor: cardBg }]}>
                                    <View style={styles.cardHeader}>
                                        <View style={[styles.iconBox, { backgroundColor: "#8b5cf620" }]}>
                                            <Ionicons name="megaphone" size={18} color="#8b5cf6" />
                                        </View>
                                        <Text style={[styles.cardTitle, { color: textColor }]}>{ann.title}</Text>
                                    </View>
                                    <Text style={[styles.cardBody, { color: subtextColor }]}>{ann.body}</Text>
                                </View>
                            ))}
                        </View>
                    ))
                )}
            </ScrollView>

            {/* FAB */}
            <Pressable style={styles.fab} onPress={() => setShowCreate(true)}>
                <Ionicons name="add" size={28} color="#fff" />
            </Pressable>

            {/* Create Modal */}
            <Modal visible={showCreate} animationType="slide" transparent onRequestClose={() => setShowCreate(false)}>
                <View style={styles.overlay}>
                    <View style={[styles.sheet, { backgroundColor: bg }]}>
                        <View style={[styles.sheetHeader, { borderBottomColor: borderColor }]}>
                            <Text style={[styles.sheetTitle, { color: textColor }]}>New Announcement</Text>
                            <Pressable onPress={() => setShowCreate(false)}>
                                <Text style={{ color: subtextColor, fontSize: 16 }}>Cancel</Text>
                            </Pressable>
                        </View>

                        <TextInput
                            style={[styles.input, { backgroundColor: cardBg, color: textColor, borderColor }]}
                            placeholder="Title"
                            placeholderTextColor={subtextColor}
                            value={newTitle}
                            onChangeText={setNewTitle}
                        />
                        <TextInput
                            style={[styles.input, styles.bodyInput, { backgroundColor: cardBg, color: textColor, borderColor }]}
                            placeholder="Announcement body..."
                            placeholderTextColor={subtextColor}
                            multiline
                            value={newBody}
                            onChangeText={setNewBody}
                        />

                        <Pressable
                            style={[styles.sendBtn, { backgroundColor: tint, opacity: (!newTitle.trim() || !newBody.trim() || isSending) ? 0.5 : 1 }]}
                            onPress={handleCreate}
                            disabled={!newTitle.trim() || !newBody.trim() || isSending}
                        >
                            <Text style={styles.sendBtnText}>{isSending ? "Posting..." : "Post Announcement"}</Text>
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
    scrollContent: { padding: 15, paddingBottom: 80 },
    errorText: { textAlign: "center", marginBottom: 12 },
    emptyText: { fontSize: 18, fontWeight: "600", marginTop: 16 },
    emptySubtext: { fontSize: 14, marginTop: 4 },
    section: { marginBottom: 16 },
    dateRow: { flexDirection: "row", alignItems: "center", marginVertical: 10 },
    line: { flex: 1, height: 1 },
    dateText: { marginHorizontal: 10, fontSize: 14 },
    card: { borderRadius: 14, padding: 16, marginBottom: 8, shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 4, elevation: 2 },
    cardHeader: { flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 8 },
    iconBox: { width: 32, height: 32, borderRadius: 8, alignItems: "center", justifyContent: "center" },
    cardTitle: { fontSize: 16, fontWeight: "600", flex: 1 },
    cardBody: { fontSize: 14, lineHeight: 20 },
    fab: { position: "absolute", bottom: 24, right: 24, width: 56, height: 56, borderRadius: 28, backgroundColor: "#0a7ea4", alignItems: "center", justifyContent: "center", elevation: 4, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 4 },
    overlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.4)", justifyContent: "flex-end" },
    sheet: { borderTopLeftRadius: 16, borderTopRightRadius: 16, padding: 20, paddingBottom: 40 },
    sheetHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingBottom: 16, marginBottom: 16, borderBottomWidth: 1 },
    sheetTitle: { fontSize: 18, fontWeight: "bold" },
    input: { borderWidth: 1, borderRadius: 12, padding: 12, fontSize: 16, marginBottom: 12 },
    bodyInput: { minHeight: 100, textAlignVertical: "top" },
    sendBtn: { borderRadius: 12, padding: 16, alignItems: "center" },
    sendBtnText: { color: "#fff", fontSize: 16, fontWeight: "700" },
});
