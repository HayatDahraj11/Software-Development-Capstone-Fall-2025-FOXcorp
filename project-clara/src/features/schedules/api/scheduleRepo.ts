import { generateClient } from "aws-amplify/api";
import { schedulesByClassId } from "@/src/graphql/queries";

const client = generateClient();

export type DayOfWeek =
  | "MONDAY"
  | "TUESDAY"
  | "WEDNESDAY"
  | "THURSDAY"
  | "FRIDAY"
  | "SATURDAY"
  | "SUNDAY";

export interface Schedule {
  id: string;
  classId: string;
  dayOfWeek: DayOfWeek;
  startTime: string; // HH:mm:ss
  endTime: string;   // HH:mm:ss
  createdAt: string;
}

export interface RepoResult<T> {
  data: T | null;
  error: string | null;
}

export async function fetchSchedulesByClass(
  classId: string
): Promise<RepoResult<Schedule[]>> {
  try {
    const result: any = await client.graphql({
      query: schedulesByClassId,
      variables: { classId },
    });
    const items: Schedule[] =
      result?.data?.schedulesByClassId?.items ?? [];
    return { data: items, error: null };
  } catch (err: any) {
    return { data: null, error: err?.message ?? "Failed to fetch schedules" };
  }
}
