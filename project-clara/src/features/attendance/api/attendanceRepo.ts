// handles all the attendance CRUD stuff with dynamodb
// uses the byClass index to grab attendance records for a specific class
// NOTE: we use custom lean mutations instead of the generated ones because the
// generated mutations request nested student/class relations via @belongsTo,
// and AppSync throws errors when those resolvers return null for required fields.
// the attendance record itself saves fine, but the nested resolver errors cause
// Amplify V6 client to treat the whole response as a failure.
import { generateClient } from "aws-amplify/api";
import { attendancesByClassId, attendancesByStudentId } from "@/src/graphql/queries";
import { AttendanceStatus } from "@/src/API";

// lazy init so Amplify.configure() has time to run before we create the client
let _client: any = null;
function getClient() {
    if (!_client) _client = generateClient();
    return _client;
}

// re-exporting so screens can import from one place
export { AttendanceStatus };

// lean mutations that only return the fields we actually need
// avoids the @belongsTo resolver errors on student/class
const createAttendanceLean = /* GraphQL */ `mutation CreateAttendance($input: CreateAttendanceInput!) {
  createAttendance(input: $input) {
    id
    studentId
    classId
    date
    status
    checkInTime
    createdAt
    updatedAt
  }
}`;

const updateAttendanceLean = /* GraphQL */ `mutation UpdateAttendance($input: UpdateAttendanceInput!) {
  updateAttendance(input: $input) {
    id
    studentId
    classId
    date
    status
    checkInTime
    createdAt
    updatedAt
  }
}`;

export interface AttendanceRecord {
  id: string;
  studentId: string;
  classId: string;
  date: string;
  status: AttendanceStatus;
  checkInTime?: string | null;
  createdAt: string;
}

export interface RepoResult<T> {
  data: T | null;
  error: string | null;
}

// grabs all attendance records for a given class
export async function fetchAttendanceByClass(
  classId: string
): Promise<RepoResult<AttendanceRecord[]>> {
  try {
    const result: any = await getClient().graphql({
      query: attendancesByClassId,
      variables: { classId },
      authMode: "apiKey",
    });
    const items: AttendanceRecord[] =
      result?.data?.attendancesByClassId?.items ?? [];
    return { data: items, error: null };
  } catch (err: any) {
    // check if data came back despite errors (partial response)
    if (err?.data?.attendancesByClassId?.items) {
      return { data: err.data.attendancesByClassId.items, error: null };
    }
    console.error("fetchAttendanceByClass failed:", JSON.stringify(err, null, 2));
    const msg = err?.errors?.[0]?.message ?? err?.message ?? "Failed to fetch attendance";
    return { data: null, error: msg };
  }
}

// grabs all attendance records for a given student (used by parent side)
export async function fetchAttendanceByStudent(
  studentId: string
): Promise<RepoResult<AttendanceRecord[]>> {
  try {
    const result: any = await getClient().graphql({
      query: attendancesByStudentId,
      variables: { studentId },
      authMode: "apiKey",
    });
    const items: AttendanceRecord[] =
      result?.data?.attendancesByStudentId?.items ?? [];
    return { data: items, error: null };
  } catch (err: any) {
    if (err?.data?.attendancesByStudentId?.items) {
      return { data: err.data.attendancesByStudentId.items, error: null };
    }
    console.error("fetchAttendanceByStudent failed:", JSON.stringify(err, null, 2));
    const msg = err?.errors?.[0]?.message ?? err?.message ?? "Failed to fetch attendance";
    return { data: null, error: msg };
  }
}

// creates a brand new attendance record for a student on a given day
export async function submitAttendance(params: {
  studentId: string;
  classId: string;
  date: string;
  status: AttendanceStatus;
}): Promise<RepoResult<AttendanceRecord>> {
  try {
    const result: any = await getClient().graphql({
      query: createAttendanceLean,
      variables: {
        input: {
          studentId: params.studentId,
          classId: params.classId,
          date: params.date,
          status: params.status,
        },
      },
      authMode: "apiKey",
    });
    return { data: result.data.createAttendance, error: null };
  } catch (err: any) {
    // Amplify V6 throws { data, errors } when GraphQL has partial errors
    // the lean mutation shouldn't have this issue, but handle it just in case
    if (err?.data?.createAttendance) {
      return { data: err.data.createAttendance, error: null };
    }
    console.error("submitAttendance failed:", JSON.stringify(err, null, 2));
    const msg = err?.errors?.[0]?.message ?? err?.message ?? "Failed to submit attendance";
    return { data: null, error: msg };
  }
}

// updates an existing record, like if teacher marked someone present but meant to mark late
export async function changeAttendance(params: {
  id: string;
  status: AttendanceStatus;
}): Promise<RepoResult<AttendanceRecord>> {
  try {
    const result: any = await getClient().graphql({
      query: updateAttendanceLean,
      variables: {
        input: {
          id: params.id,
          status: params.status,
        },
      },
      authMode: "apiKey",
    });
    return { data: result.data.updateAttendance, error: null };
  } catch (err: any) {
    if (err?.data?.updateAttendance) {
      return { data: err.data.updateAttendance, error: null };
    }
    console.error("changeAttendance failed:", JSON.stringify(err, null, 2));
    const msg = err?.errors?.[0]?.message ?? err?.message ?? "Failed to update attendance";
    return { data: null, error: msg };
  }
}
