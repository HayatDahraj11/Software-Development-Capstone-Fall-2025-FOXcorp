// handles incident report crud with dynamodb
// note: the byClass index doesnt have a sort key so we cant use sortDirection
// sorting happens client side in the hook instead
import { generateClient } from "aws-amplify/api";
import { incidentsByClassId, incidentsByStudentId } from "@/src/graphql/queries";

// lean mutation that only returns flat fields we need
// the generated createIncident requests nested @belongsTo relations
// (teacher, student, class, school) which cause AppSync resolver errors
const createIncidentLean = /* GraphQL */ `mutation CreateIncident($input: CreateIncidentInput!) {
  createIncident(input: $input) {
    id
    description
    severity
    date
    teacherId
    studentId
    classId
    schoolId
    createdAt
    updatedAt
  }
}`;

// lazy init so Amplify.configure() has time to run before we create the client
let _client: any = null;
function getClient() {
    if (!_client) _client = generateClient();
    return _client;
}

export interface Incident {
  id: string;
  description: string;
  severity: string;
  date: string;
  teacherId: string;
  studentId: string;
  classId?: string | null;
  schoolId: string;
  student?: { id: string; firstName: string; lastName: string } | null;
  createdAt: string;
}

export interface RepoResult<T> {
  data: T | null;
  error: string | null;
}

// pulls all incidents for a class
export async function fetchIncidentsByClass(
  classId: string
): Promise<RepoResult<Incident[]>> {
  try {
    const result: any = await getClient().graphql({
      query: incidentsByClassId,
      variables: { classId },
      authMode: "apiKey",
    });
    const items: Incident[] =
      result?.data?.incidentsByClassId?.items ?? [];
    return { data: items, error: null };
  } catch (err: any) {
    return { data: null, error: err?.message ?? "Failed to fetch incidents" };
  }
}

// pulls all incidents for a specific student (used by parent side)
export async function fetchIncidentsByStudent(
  studentId: string
): Promise<RepoResult<Incident[]>> {
  try {
    const result: any = await getClient().graphql({
      query: incidentsByStudentId,
      variables: { studentId },
      authMode: "apiKey",
    });
    const items: Incident[] =
      result?.data?.incidentsByStudentId?.items ?? [];
    return { data: items, error: null };
  } catch (err: any) {
    if (err?.data?.incidentsByStudentId?.items) {
      return { data: err.data.incidentsByStudentId.items, error: null };
    }
    console.error("fetchIncidentsByStudent failed:", JSON.stringify(err, null, 2));
    const msg = err?.errors?.[0]?.message ?? err?.message ?? "Failed to fetch incidents";
    return { data: null, error: msg };
  }
}

// files a new incident report, needs all the relationship ids (teacher, student, class, school)
export async function reportIncident(params: {
  description: string;
  severity: string;
  date: string;
  teacherId: string;
  studentId: string;
  classId: string;
  schoolId: string;
}): Promise<RepoResult<Incident>> {
  try {
    const result: any = await getClient().graphql({
      query: createIncidentLean,
      variables: {
        input: {
          description: params.description,
          severity: params.severity,
          date: params.date,
          teacherId: params.teacherId,
          studentId: params.studentId,
          classId: params.classId,
          schoolId: params.schoolId,
        },
      },
      authMode: "apiKey",
    });
    return { data: result.data.createIncident, error: null };
  } catch (err: any) {
    if (err?.data?.createIncident) {
      return { data: err.data.createIncident, error: null };
    }
    console.error("reportIncident failed:", JSON.stringify(err, null, 2));
    const msg = err?.errors?.[0]?.message ?? err?.message ?? "Failed to report incident";
    return { data: null, error: msg };
  }
}
