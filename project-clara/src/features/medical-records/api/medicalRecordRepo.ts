import { generateClient } from "aws-amplify/api";
import { medicalRecordsByStudentId } from "@/src/graphql/queries";

// lean mutations avoid @belongsTo resolver errors on nested student relation
const createMedicalRecordLean = /* GraphQL */ `mutation CreateMedicalRecord($input: CreateMedicalRecordInput!) {
  createMedicalRecord(input: $input) {
    id
    studentId
    allergies
    medications
    conditions
    emergencyNotes
    createdAt
    updatedAt
  }
}`;

const updateMedicalRecordLean = /* GraphQL */ `mutation UpdateMedicalRecord($input: UpdateMedicalRecordInput!) {
  updateMedicalRecord(input: $input) {
    id
    studentId
    allergies
    medications
    conditions
    emergencyNotes
    createdAt
    updatedAt
  }
}`;

let _client: any = null;
function getClient() {
    if (!_client) _client = generateClient();
    return _client;
}

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
    const result: any = await getClient().graphql({
      query: medicalRecordsByStudentId,
      variables: { studentId },
      authMode: "apiKey",
    });

    const items = result?.data?.medicalRecordsByStudentId?.items ?? [];
    const record = items.length > 0 ? items[0] : null;

    return { data: record, error: null };
  } catch (err: any) {
    return { data: null, error: err?.message ?? "Failed to fetch medical record" };
  }
}

export async function createMedicalRecord(
  studentId: string,
  fields: {
    allergies?: string | null;
    medications?: string | null;
    conditions?: string | null;
    emergencyNotes?: string | null;
  }
): Promise<RepoResult<MedicalRecord>> {
  try {
    const result: any = await getClient().graphql({
      query: createMedicalRecordLean,
      variables: {
        input: { studentId, ...fields },
      },
      authMode: "apiKey",
    });
    return { data: result.data.createMedicalRecord, error: null };
  } catch (err: any) {
    if (err?.data?.createMedicalRecord) {
      return { data: err.data.createMedicalRecord, error: null };
    }
    console.error("createMedicalRecord failed:", JSON.stringify(err, null, 2));
    const msg = err?.errors?.[0]?.message ?? err?.message ?? "Failed to create medical record";
    return { data: null, error: msg };
  }
}

export async function updateMedicalRecord(
  recordId: string,
  fields: {
    allergies?: string | null;
    medications?: string | null;
    conditions?: string | null;
    emergencyNotes?: string | null;
  }
): Promise<RepoResult<MedicalRecord>> {
  try {
    const result: any = await getClient().graphql({
      query: updateMedicalRecordLean,
      variables: {
        input: { id: recordId, ...fields },
      },
      authMode: "apiKey",
    });
    return { data: result.data.updateMedicalRecord, error: null };
  } catch (err: any) {
    if (err?.data?.updateMedicalRecord) {
      return { data: err.data.updateMedicalRecord, error: null };
    }
    console.error("updateMedicalRecord failed:", JSON.stringify(err, null, 2));
    const msg = err?.errors?.[0]?.message ?? err?.message ?? "Failed to update medical record";
    return { data: null, error: msg };
  }
}
