import { generateClient } from "aws-amplify/api";
import { announcementsByClassId } from "@/src/graphql/queries";
import { createAnnouncement } from "@/src/graphql/mutations";

const client = generateClient();

export interface Announcement {
    id: string;
    title: string;
    body: string;
    createdAt: string;
    createdBy: string;
    classId?: string | null;
}

export interface RepoResult<T> {
    data: T | null;
    error: string | null;
}

export async function fetchAnnouncementsByClass(
    classId: string
): Promise<RepoResult<Announcement[]>> {
    try {
        const result: any = await client.graphql({
            query: announcementsByClassId,
            variables: { classId, sortDirection: "DESC" },
        });
        const items: Announcement[] = result?.data?.announcementsByClassId?.items ?? [];
        return { data: items, error: null };
    } catch (err: any) {
        return { data: null, error: err?.message ?? "Failed to fetch announcements" };
    }
}

export async function postAnnouncement(params: {
    title: string;
    body: string;
    createdBy: string;
    classId: string;
}): Promise<RepoResult<Announcement>> {
    try {
        const result: any = await client.graphql({
            query: createAnnouncement,
            variables: {
                input: {
                    title: params.title,
                    body: params.body,
                    createdBy: params.createdBy,
                    classId: params.classId,
                },
            },
        });
        return { data: result.data.createAnnouncement, error: null };
    } catch (err: any) {
        return { data: null, error: err?.message ?? "Failed to create announcement" };
    }
}
