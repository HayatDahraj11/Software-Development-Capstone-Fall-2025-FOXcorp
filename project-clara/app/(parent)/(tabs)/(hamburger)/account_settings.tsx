import { ScrollView, StyleSheet, Text, View } from "react-native";
import { useThemeColor } from "@/src/features/app-themes/logic/use-theme-color";
import { useParentLoginContext } from "@/src/features/context/ParentLoginContext";

export default function AccountSettingsScreen() {
  const { userParent, isDebug } = useParentLoginContext();
  const bg = useThemeColor({}, "background");
  const cardBg = useThemeColor({}, "cardBackground");
  const textColor = useThemeColor({}, "text");
  const subtextColor = useThemeColor({}, "placeholderText");
  const tint = useThemeColor({}, "tint");

  const initials = `${userParent.firstName?.[0] ?? ""}${userParent.lastName?.[0] ?? ""}`;

  return (
    <ScrollView style={[styles.container, { backgroundColor: bg }]} contentContainerStyle={styles.content}>
      <View style={[styles.avatarCircle, { backgroundColor: tint }]}>
        <Text style={styles.avatarText}>{initials}</Text>
      </View>
      <Text style={[styles.name, { color: textColor }]}>
        {userParent.firstName} {userParent.lastName}
      </Text>
      <Text style={[styles.role, { color: subtextColor }]}>Parent Account</Text>

      <View style={[styles.infoCard, { backgroundColor: cardBg }]}>
        <InfoRow label="Name" value={`${userParent.firstName} ${userParent.lastName}`} textColor={textColor} subtextColor={subtextColor} />
        <InfoRow label="Role" value="Parent" textColor={textColor} subtextColor={subtextColor} />
        <InfoRow label="Account Type" value={isDebug ? "Debug" : "AWS Cognito"} textColor={textColor} subtextColor={subtextColor} />
        <InfoRow label="User ID" value={userParent.userId} textColor={textColor} subtextColor={subtextColor} last />
      </View>
    </ScrollView>
  );
}

function InfoRow({ label, value, textColor, subtextColor, last }: {
  label: string; value: string; textColor: string; subtextColor: string; last?: boolean;
}) {
  return (
    <View style={[styles.infoRow, !last && { borderBottomWidth: 1, borderBottomColor: subtextColor + "30" }]}>
      <Text style={[styles.infoLabel, { color: subtextColor }]}>{label}</Text>
      <Text style={[styles.infoValue, { color: textColor }]} numberOfLines={1}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { alignItems: "center", paddingTop: 32, paddingHorizontal: 20, paddingBottom: 40 },
  avatarCircle: { width: 72, height: 72, borderRadius: 36, alignItems: "center", justifyContent: "center" },
  avatarText: { color: "#fff", fontSize: 28, fontWeight: "700" },
  name: { fontSize: 22, fontWeight: "700", marginTop: 14 },
  role: { fontSize: 14, marginTop: 4, marginBottom: 28 },
  infoCard: { width: "100%", borderRadius: 14, overflow: "hidden" },
  infoRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", padding: 16 },
  infoLabel: { fontSize: 14 },
  infoValue: { fontSize: 14, fontWeight: "600", flexShrink: 1, textAlign: "right", maxWidth: "60%" },
});
