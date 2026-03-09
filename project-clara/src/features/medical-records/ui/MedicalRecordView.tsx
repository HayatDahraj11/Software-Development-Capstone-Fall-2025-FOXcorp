import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from "react-native";
import { useThemeColor } from "@/src/features/app-themes/logic/use-theme-color";
import { useMedicalRecord } from "../logic/useMedicalRecord";

interface Props {
  studentId: string;
}

interface SectionProps {
  title: string;
  content: string | null | undefined;
  textColor: string;
  cardBg: string;
}

function Section({ title, content, textColor, cardBg }: SectionProps) {
  if (!content) return null;
  return (
    <View style={[styles.card, { backgroundColor: cardBg }]}>
      <Text style={[styles.sectionTitle, { color: textColor }]}>{title}</Text>
      <Text style={[styles.sectionBody, { color: textColor }]}>{content}</Text>
    </View>
  );
}

export default function MedicalRecordView({ studentId }: Props) {
  const { record, isLoading, error } = useMedicalRecord(studentId);
  const textColor = useThemeColor({}, "text");
  const cardBg = useThemeColor({}, "cardBackground");
  const bg = useThemeColor({}, "background");

  if (isLoading) {
    return (
      <View style={[styles.center, { backgroundColor: bg }]}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.center, { backgroundColor: bg }]}>
        <Text style={{ color: "red" }}>{error}</Text>
      </View>
    );
  }

  if (!record) {
    return (
      <View style={[styles.center, { backgroundColor: bg }]}>
        <Text style={{ color: textColor, fontSize: 16 }}>No records found</Text>
      </View>
    );
  }

  return (
    <ScrollView style={{ flex: 1, backgroundColor: bg }} contentContainerStyle={styles.container}>
      <Section title="Allergies" content={record.allergies} textColor={textColor} cardBg={cardBg} />
      <Section title="Medications" content={record.medications} textColor={textColor} cardBg={cardBg} />
      <Section title="Conditions" content={record.conditions} textColor={textColor} cardBg={cardBg} />
      <Section title="Emergency Notes" content={record.emergencyNotes} textColor={textColor} cardBg={cardBg} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    gap: 12,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    borderRadius: 10,
    padding: 15,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 6,
  },
  sectionBody: {
    fontSize: 15,
    lineHeight: 22,
  },
});
