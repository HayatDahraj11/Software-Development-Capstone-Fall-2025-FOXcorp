// handles announcement crud with dynamodb
// note: the byClass index doesnt have a sort key so we cant use sortDirection
// sorting happens client side in the hook instead
import { generateClient } from "aws-amplify/api";
import { announcementsByClassId } from "@/src/graphql/queries";
import { createAnnouncement } from "@/src/graphql/mutations";

// lazy init so Amplify.configure() has time to run before we create the client
let _client: any = null;
function getClient() {
    if (!_client) _client = generateClient();
    return _client;
}

export interface Announcement {
    id: string;
    title: string;
    body: string;
    createdAt: string;
    createdBy: string;
    classId?: string | null;
    schoolId?: string | null;
}

export interface RepoResult<T> {
    data: T | null;
    error: string | null;
}

// pulls all announcements for a class
export async function fetchAnnouncementsByClass(
    classId: string
): Promise<RepoResult<Announcement[]>> {
    try {
        const result: any = await getClient().graphql({
            query: announcementsByClassId,
            variables: { classId },
            authMode: "apiKey",
        });
        const items: Announcement[] = result?.data?.announcementsByClassId?.items ?? [];
        return { data: items, error: null };
    } catch (err: any) {
        console.error("fetchAnnouncementsByClass failed:", JSON.stringify(err, null, 2));
        const msg = err?.errors?.[0]?.message ?? err?.message ?? "Failed to fetch announcements";
        return { data: null, error: msg };
    }
}

export async function postAnnouncement(params: {
    title: string;
    body: string;
    createdBy: string;
    classId: string;
}): Promise<RepoResult<Announcement>> {
    try {
        const result: any = await getClient().graphql({
            query: createAnnouncement,
            variables: {
                input: {
                    title: params.title,
                    body: params.body,
                    createdBy: params.createdBy,
                    classId: params.classId,
                },
            },
            authMode: "apiKey",
        });
        return { data: result.data.createAnnouncement, error: null };
    } catch (err: any) {
        // Amplify V6 throws an object with { data, errors } when GraphQL returns errors
        // check if data actually came back despite the errors
        if (err?.data?.createAnnouncement) {
            return { data: err.data.createAnnouncement, error: null };
        }
        console.error("postAnnouncement failed:", JSON.stringify(err, null, 2));
        const msg = err?.errors?.[0]?.message ?? err?.message ?? "Failed to create announcement";
        return { data: null, error: msg };
    }
}
