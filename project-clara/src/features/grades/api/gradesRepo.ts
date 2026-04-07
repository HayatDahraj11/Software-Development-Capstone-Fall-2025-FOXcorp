// handles grade updates for enrollments
// uses a lean mutation to avoid @belongsTo resolver errors
import { generateClient } from "aws-amplify/api";

const updateEnrollmentLean = /* GraphQL */ `mutation UpdateEnrollment($input: UpdateEnrollmentInput!) {
  updateEnrollment(input: $input) {
    id
    studentId
    classId
    currentGrade
    createdAt
    updatedAt
  }
}`;

let _client: any = null;
function getClient() {
    if (!_client) _client = generateClient();
    return _client;
}

export interface RepoResult<T> {
    data: T | null;
    error: string | null;
}

export async function updateStudentGrade(
    enrollmentId: string,
    grade: number
): Promise<RepoResult<{ id: string; currentGrade: number }>> {
    try {
        const result: any = await getClient().graphql({
            query: updateEnrollmentLean,
            variables: {
                input: {
                    id: enrollmentId,
                    currentGrade: grade,
                },
            },
            authMode: "apiKey",
        });
        return { data: result.data.updateEnrollment, error: null };
    } catch (err: any) {
        if (err?.data?.updateEnrollment) {
            return { data: err.data.updateEnrollment, error: null };
        }
        console.error("updateStudentGrade failed:", JSON.stringify(err, null, 2));
        const msg = err?.errors?.[0]?.message ?? err?.message ?? "Failed to update grade";
        return { data: null, error: msg };
    }
}
