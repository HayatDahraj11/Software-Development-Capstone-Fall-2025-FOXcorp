import { generateClient } from "aws-amplify/api";
import { medicalRecordsByStudentId } from "@/src/graphql/queries";

const client = generateClient();

export interface MedicalRecord {
  id: string;
  studentId: string;
  allergies?: string | null;
  medications?: string | null;
  conditions?: string | null;
  emergencyNotes?: string | null;
}

export interface RepoResult<T> {
  data: T | null;
  error: string | null;
}

export async function fetchMedicalRecord(
  studentId: string
): Promise<RepoResult<MedicalRecord>> {
  try {
    const result: any = await client.graphql({
      query: medicalRecordsByStudentId,
      variables: { studentId },
    });

    const items = result?.data?.medicalRecordsByStudentId?.items ?? [];
    const record = items.length > 0 ? items[0] : null;

    return { data: record, error: null };
  } catch (err: any) {
    return { data: null, error: err?.message ?? "Failed to fetch medical record" };
  }
}
