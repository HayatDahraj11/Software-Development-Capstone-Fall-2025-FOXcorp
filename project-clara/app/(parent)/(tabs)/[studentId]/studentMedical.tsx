import { useLocalSearchParams } from "expo-router";
import MedicalRecordView from "@/src/features/medical-records/ui/MedicalRecordView";

export default function StudentMedicalScreen() {
  const { studentId } = useLocalSearchParams<{ studentId: string }>();
  return <MedicalRecordView studentId={studentId} />;
}
