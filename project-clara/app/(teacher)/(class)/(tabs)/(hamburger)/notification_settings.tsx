import { useCallback, useEffect, useState } from "react";
import { ScrollView, StyleSheet, Switch, Text, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useThemeColor } from "@/src/features/app-themes/logic/use-theme-color";

const STORAGE_KEY = "notification_prefs_teacher";

export default function NotificationSettingsScreen() {
  const bg = useThemeColor({}, "background");
  const cardBg = useThemeColor({}, "cardBackground");
  const textColor = useThemeColor({}, "text");
  const subtextColor = useThemeColor({}, "placeholderText");
  const tint = useThemeColor({}, "tint");

  const [pushEnabled, setPushEnabled] = useState(true);
  const [messageEnabled, setMessageEnabled] = useState(true);
  const [announcementEnabled, setAnnouncementEnabled] = useState(true);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((val) => {
      if (val) {
        const prefs = JSON.parse(val);
        setPushEnabled(prefs.push ?? true);
        setMessageEnabled(prefs.messages ?? true);
        setAnnouncementEnabled(prefs.announcements ?? true);
      }
    });
  }, []);

  const save = useCallback((push: boolean, messages: boolean, announcements: boolean) => {
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify({ push, messages, announcements }));
  }, []);

  const togglePush = (val: boolean) => { setPushEnabled(val); save(val, messageEnabled, announcementEnabled); };
  const toggleMessages = (val: boolean) => { setMessageEnabled(val); save(pushEnabled, val, announcementEnabled); };
  const toggleAnnouncements = (val: boolean) => { setAnnouncementEnabled(val); save(pushEnabled, messageEnabled, val); };

  return (
    <ScrollView style={[styles.container, { backgroundColor: bg }]} contentContainerStyle={styles.content}>
      <Text style={[styles.sectionLabel, { color: subtextColor }]}>NOTIFICATION PREFERENCES</Text>
      <View style={[styles.card, { backgroundColor: cardBg }]}>
        <ToggleRow label="Push Notifications" subtitle="Receive push notifications on this device" value={pushEnabled} onToggle={togglePush} textColor={textColor} subtextColor={subtextColor} tint={tint} />
        <ToggleRow label="Messages" subtitle="Notifications for new messages from parents" value={messageEnabled} onToggle={toggleMessages} textColor={textColor} subtextColor={subtextColor} tint={tint} />
        <ToggleRow label="Announcements" subtitle="Notifications for class announcements" value={announcementEnabled} onToggle={toggleAnnouncements} textColor={textColor} subtextColor={subtextColor} tint={tint} last />
      </View>
    </ScrollView>
  );
}

function ToggleRow({ label, subtitle, value, onToggle, textColor, subtextColor, tint, last }: {
  label: string; subtitle: string; value: boolean; onToggle: (val: boolean) => void;
  textColor: string; subtextColor: string; tint: string; last?: boolean;
}) {
  return (
    <View style={[styles.row, !last && { borderBottomWidth: 1, borderBottomColor: subtextColor + "30" }]}>
      <View style={styles.rowText}>
        <Text style={[styles.rowLabel, { color: textColor }]}>{label}</Text>
        <Text style={[styles.rowSubtitle, { color: subtextColor }]}>{subtitle}</Text>
      </View>
      <Switch value={value} onValueChange={onToggle} trackColor={{ true: tint, false: subtextColor + "40" }} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 20, paddingBottom: 40 },
  sectionLabel: { fontSize: 12, fontWeight: "700", letterSpacing: 1, marginBottom: 10, marginLeft: 4 },
  card: { borderRadius: 14, overflow: "hidden" },
  row: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", padding: 16 },
  rowText: { flex: 1, marginRight: 12 },
  rowLabel: { fontSize: 16, fontWeight: "600" },
  rowSubtitle: { fontSize: 13, marginTop: 2 },
});
