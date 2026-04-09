// repo for class schedules — fetch, create, update, delete
import { generateClient } from "aws-amplify/api";
import { schedulesByClassId } from "@/src/graphql/queries";

// lean mutations avoid @belongsTo resolver errors on nested class relation
const createScheduleLean = /* GraphQL */ `mutation CreateSchedule($input: CreateScheduleInput!) {
  createSchedule(input: $input) {
    id classId dayOfWeek startTime endTime createdAt updatedAt
  }
}`;

const updateScheduleLean = /* GraphQL */ `mutation UpdateSchedule($input: UpdateScheduleInput!) {
  updateSchedule(input: $input) {
    id classId dayOfWeek startTime endTime createdAt updatedAt
  }
}`;

const deleteScheduleLean = /* GraphQL */ `mutation DeleteSchedule($input: DeleteScheduleInput!) {
  deleteSchedule(input: $input) { id }
}`;

// lazy init so Amplify.configure() has time to run before we create the client
let _client: any = null;
function getClient() {
    if (!_client) _client = generateClient();
    return _client;
}

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
    const result: any = await getClient().graphql({
      query: schedulesByClassId,
      variables: { classId },
      authMode: "apiKey",
    });
    const items: Schedule[] =
      result?.data?.schedulesByClassId?.items ?? [];
    return { data: items, error: null };
  } catch (err: any) {
    return { data: null, error: err?.message ?? "Failed to fetch schedules" };
  }
}

export async function createSchedule(params: {
  classId: string;
  dayOfWeek: DayOfWeek;
  startTime: string;
  endTime: string;
}): Promise<RepoResult<Schedule>> {
  try {
    const result: any = await getClient().graphql({
      query: createScheduleLean,
      variables: { input: params },
      authMode: "apiKey",
    });
    return { data: result.data.createSchedule, error: null };
  } catch (err: any) {
    if (err?.data?.createSchedule) {
      return { data: err.data.createSchedule, error: null };
    }
    console.error("createSchedule failed:", JSON.stringify(err, null, 2));
    const msg = err?.errors?.[0]?.message ?? err?.message ?? "Failed to create schedule";
    return { data: null, error: msg };
  }
}

export async function updateScheduleEntry(
  scheduleId: string,
  fields: { dayOfWeek?: DayOfWeek; startTime?: string; endTime?: string }
): Promise<RepoResult<Schedule>> {
  try {
    const result: any = await getClient().graphql({
      query: updateScheduleLean,
      variables: { input: { id: scheduleId, ...fields } },
      authMode: "apiKey",
    });
    return { data: result.data.updateSchedule, error: null };
  } catch (err: any) {
    if (err?.data?.updateSchedule) {
      return { data: err.data.updateSchedule, error: null };
    }
    console.error("updateSchedule failed:", JSON.stringify(err, null, 2));
    const msg = err?.errors?.[0]?.message ?? err?.message ?? "Failed to update schedule";
    return { data: null, error: msg };
  }
}

export async function deleteScheduleEntry(
  scheduleId: string
): Promise<RepoResult<{ id: string }>> {
  try {
    const result: any = await getClient().graphql({
      query: deleteScheduleLean,
      variables: { input: { id: scheduleId } },
      authMode: "apiKey",
    });
    return { data: result.data.deleteSchedule, error: null };
  } catch (err: any) {
    if (err?.data?.deleteSchedule) {
      return { data: err.data.deleteSchedule, error: null };
    }
    console.error("deleteSchedule failed:", JSON.stringify(err, null, 2));
    const msg = err?.errors?.[0]?.message ?? err?.message ?? "Failed to delete schedule";
    return { data: null, error: msg };
  }
}
