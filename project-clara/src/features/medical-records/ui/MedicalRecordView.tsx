import { useState } from "react";
import { ActivityIndicator, Alert, Modal, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useThemeColor } from "@/src/features/app-themes/logic/use-theme-color";
import { useMedicalRecord } from "../logic/useMedicalRecord";

interface Props {
  studentId: string;
}

type FieldKey = "allergies" | "medications" | "conditions" | "emergencyNotes";

const FIELD_CONFIG: { key: FieldKey; title: string; icon: string; color: string }[] = [
  { key: "allergies", title: "Allergies", icon: "warning", color: "#dc2626" },
  { key: "medications", title: "Medications", icon: "medical", color: "#8b5cf6" },
  { key: "conditions", title: "Conditions", icon: "fitness", color: "#d97706" },
  { key: "emergencyNotes", title: "Emergency Notes", icon: "call", color: "#3b82f6" },
];

export default function MedicalRecordView({ studentId }: Props) {
  const { record, isLoading, error, saveFields, isSaving } = useMedicalRecord(studentId);
  const textColor = useThemeColor({}, "text");
  const cardBg = useThemeColor({}, "cardBackground");
  const bg = useThemeColor({}, "background");
  const subtextColor = useThemeColor({}, "placeholderText");
  const tintColor = useThemeColor({}, "tint");
  const borderColor = useThemeColor({}, "listBorderTranslucent");
  const modalBg = useThemeColor({}, "modalBackground");

  const [editField, setEditField] = useState<FieldKey | null>(null);
  const [editValue, setEditValue] = useState("");

  const openEdit = (key: FieldKey) => {
    setEditField(key);
    setEditValue(record?.[key] ?? "");
  };

  const handleSave = async () => {
    if (!editField) return;
    const success = await saveFields({ [editField]: editValue.trim() || null });
    if (success) {
      setEditField(null);
    } else {
      Alert.alert("Error", "Failed to save. Please try again.");
    }
  };

  if (isLoading) {
    return (
      <View style={[styles.center, { backgroundColor: bg }]}>
        <ActivityIndicator size="large" color={tintColor} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.center, { backgroundColor: bg }]}>
        <Ionicons name="alert-circle" size={32} color="#dc2626" />
        <Text style={{ color: "#dc2626", marginTop: 8 }}>{error}</Text>
      </View>
    );
  }

  const editingConfig = editField ? FIELD_CONFIG.find(f => f.key === editField) : null;

  // Edit modal — shared between "no record" and "has record" states
  const editModal = (
    <Modal visible={!!editField} transparent animationType="fade" onRequestClose={() => setEditField(null)}>
      <Pressable style={styles.modalOverlay} onPress={() => setEditField(null)}>
        <Pressable style={[styles.modalSheet, { backgroundColor: modalBg }]} onPress={(e) => e.stopPropagation()}>
          <Text style={[styles.modalTitle, { color: textColor }]}>
            {record ? "Edit" : "Add"} {editingConfig?.title}
          </Text>

          <TextInput
            style={[styles.textInput, { color: textColor, borderColor, backgroundColor: cardBg }]}
            value={editValue}
            onChangeText={setEditValue}
            placeholder={`Enter ${editingConfig?.title?.toLowerCase() ?? "value"}...`}
            placeholderTextColor={subtextColor}
            multiline
            autoFocus={Platform.OS !== "web"}
          />

          <View style={styles.modalButtons}>
            <Pressable
              style={[styles.modalBtn, { backgroundColor: subtextColor + "20" }]}
              onPress={() => setEditField(null)}
            >
              <Text style={[styles.modalBtnText, { color: textColor }]}>Cancel</Text>
            </Pressable>
            <Pressable
              style={[styles.modalBtn, { backgroundColor: tintColor, opacity: isSaving ? 0.6 : 1 }]}
              onPress={handleSave}
              disabled={isSaving}
            >
              <Text style={[styles.modalBtnText, { color: "#fff" }]}>
                {isSaving ? "Saving..." : "Save"}
              </Text>
            </Pressable>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );

  if (!record) {
    return (
      <View style={[styles.center, { backgroundColor: bg }]}>
        <Ionicons name="document-text-outline" size={48} color={subtextColor} />
        <Text style={{ color: subtextColor, fontSize: 16, marginTop: 12 }}>No medical records found</Text>
        <Text style={{ color: subtextColor, fontSize: 13, marginTop: 4 }}>Tap below to add medical information</Text>
        <Pressable
          style={[styles.createBtn, { backgroundColor: tintColor }]}
          onPress={() => openEdit("allergies")}
        >
          <Ionicons name="add" size={18} color="#fff" />
          <Text style={{ color: "#fff", fontSize: 15, fontWeight: "600", marginLeft: 6 }}>Add Medical Info</Text>
        </Pressable>
        {editModal}
      </View>
    );
  }

  return (
    <ScrollView style={{ flex: 1, backgroundColor: bg }} contentContainerStyle={styles.container}>
      <Text style={[styles.hint, { color: subtextColor }]}>Tap a section to edit</Text>

      {FIELD_CONFIG.map(({ key, title, icon, color }) => {
        const content = record[key];
        return (
          <Pressable
            key={key}
            style={({ pressed }) => [styles.card, { backgroundColor: cardBg, opacity: pressed ? 0.85 : 1 }]}
            onPress={() => openEdit(key)}
          >
            <View style={styles.cardHeader}>
              <View style={[styles.iconBox, { backgroundColor: color + "20" }]}>
                <Ionicons name={icon as any} size={18} color={color} />
              </View>
              <Text style={[styles.sectionTitle, { color: textColor }]}>{title}</Text>
              <Ionicons name="pencil" size={14} color={subtextColor} />
            </View>
            <Text style={[styles.sectionBody, { color: content ? textColor : subtextColor }]}>
              {content || `No ${title.toLowerCase()} on file`}
            </Text>
          </Pressable>
        );
      })}

      {editModal}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    gap: 10,
    paddingBottom: 40,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  hint: {
    fontSize: 12,
    fontStyle: "italic",
    marginBottom: 4,
    marginLeft: 4,
  },
  card: {
    borderRadius: 14,
    padding: 16,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 8,
  },
  iconBox: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: "600",
    flex: 1,
  },
  sectionBody: {
    fontSize: 14,
    lineHeight: 20,
    marginLeft: 42,
  },
  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.4)", justifyContent: "center", alignItems: "center" },
  modalSheet: { width: "85%", maxWidth: 400, borderRadius: 16, padding: 24 },
  modalTitle: { fontSize: 20, fontWeight: "700", marginBottom: 16 },
  textInput: { borderWidth: 1, borderRadius: 12, padding: 14, minHeight: 120, textAlignVertical: "top", fontSize: 15, marginBottom: 20 },
  modalButtons: { flexDirection: "row", gap: 12 },
  modalBtn: { flex: 1, paddingVertical: 12, borderRadius: 10, alignItems: "center" },
  modalBtnText: { fontSize: 15, fontWeight: "600" },
  createBtn: { flexDirection: "row", alignItems: "center", marginTop: 20, paddingHorizontal: 20, paddingVertical: 12, borderRadius: 12 },
});
