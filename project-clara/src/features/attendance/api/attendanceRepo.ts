import { generateClient } from "aws-amplify/api";
import { attendancesByClassId } from "@/src/graphql/queries";
import { createAttendance, updateAttendance } from "@/src/graphql/mutations";
import { AttendanceStatus } from "@/src/API";

const client = generateClient();

export { AttendanceStatus };

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

export async function fetchAttendanceByClass(
  classId: string
): Promise<RepoResult<AttendanceRecord[]>> {
  try {
    const result: any = await client.graphql({
      query: attendancesByClassId,
      variables: { classId },
    });
    const items: AttendanceRecord[] =
      result?.data?.attendancesByClassId?.items ?? [];
    return { data: items, error: null };
  } catch (err: any) {
    return { data: null, error: err?.message ?? "Failed to fetch attendance" };
  }
}

export async function submitAttendance(params: {
  studentId: string;
  classId: string;
  date: string;
  status: AttendanceStatus;
}): Promise<RepoResult<AttendanceRecord>> {
  try {
    const result: any = await client.graphql({
      query: createAttendance,
      variables: {
        input: {
          studentId: params.studentId,
          classId: params.classId,
          date: params.date,
          status: params.status,
        },
      },
    });
    return { data: result.data.createAttendance, error: null };
  } catch (err: any) {
    return { data: null, error: err?.message ?? "Failed to submit attendance" };
  }
}

export async function changeAttendance(params: {
  id: string;
  status: AttendanceStatus;
}): Promise<RepoResult<AttendanceRecord>> {
  try {
    const result: any = await client.graphql({
      query: updateAttendance,
      variables: {
        input: {
          id: params.id,
          status: params.status,
        },
      },
    });
    return { data: result.data.updateAttendance, error: null };
  } catch (err: any) {
    return { data: null, error: err?.message ?? "Failed to update attendance" };
  }
}
