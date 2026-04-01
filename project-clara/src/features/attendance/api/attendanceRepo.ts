// handles all the attendance CRUD stuff with dynamodb
// uses the byClass index to grab attendance records for a specific class
import { generateClient } from "aws-amplify/api";
import { attendancesByClassId } from "@/src/graphql/queries";
import { createAttendance, updateAttendance } from "@/src/graphql/mutations";
import { AttendanceStatus } from "@/src/API";

const client = generateClient();

// re-exporting so screens can import from one place
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

// grabs all attendance records for a given class
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

// creates a brand new attendance record for a student on a given day
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

// updates an existing record, like if teacher marked someone present but meant to mark late
export async function changeAttendance(params: {
  id: string;
  status: AttendanceStatus;
}): Promise<RepoResult<AttendanceRecord>> {
 try {
    // 1. Update attendance
    const result: any = await client.graphql({
      query: updateAttendance,
      variables: {
        input: {
          id: params.id,
          status: params.status,
        },
      },
    });

    // Send message only if ABSENT or LATE
    if (params.status === "ABSENT" || params.status === "LATE") {
      // Find conversation for this student
      const convoRes: any = await client.graphql({
        query: listConversations,
        variables: {
          filter: { studentId: { eq: params.studentId } },
        },
      });

      const conversation =
        convoRes?.data?.listConversations?.items?.[0];

      // If no conversation, skip
      if (conversation) {
        await client.graphql({
          query: createMessage,
          variables: {
            input: {
              conversationId: conversation.id,
              senderId: "teacher-id", // can improve later
              senderType: "TEACHER",
              senderName: "Teacher",
              body: `Student marked ${params.status} today`,
              createdAt: new Date().toISOString(),
            },
          },
        });
      }
    }

    return { data: result.data.updateAttendance, error: null };
  } catch (err: any) {
    return { data: null, error: err?.message ?? "Failed to update attendance" };
  }
}
