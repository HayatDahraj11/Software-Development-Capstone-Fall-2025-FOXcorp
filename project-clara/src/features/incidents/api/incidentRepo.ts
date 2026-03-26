// handles incident report crud with dynamodb
// note: the byClass index doesnt have a sort key so we cant use sortDirection
// sorting happens client side in the hook instead
import { generateClient } from "aws-amplify/api";
import { incidentsByClassId } from "@/src/graphql/queries";
import { createIncident } from "@/src/graphql/mutations";

const client = generateClient();

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
    const result: any = await client.graphql({
      query: incidentsByClassId,
      variables: { classId },
    });
    const items: Incident[] =
      result?.data?.incidentsByClassId?.items ?? [];
    return { data: items, error: null };
  } catch (err: any) {
    return { data: null, error: err?.message ?? "Failed to fetch incidents" };
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
    const result: any = await client.graphql({
      query: createIncident,
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
    });
    return { data: result.data.createIncident, error: null };
  } catch (err: any) {
    return { data: null, error: err?.message ?? "Failed to report incident" };
  }
}
