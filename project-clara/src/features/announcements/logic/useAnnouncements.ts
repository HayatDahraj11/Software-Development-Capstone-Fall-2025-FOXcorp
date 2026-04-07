// hook for loading and creating announcements
// sorts by newest first since the graphql index cant do it for us
import { useCallback, useEffect, useRef, useState } from "react";
import { Announcement, fetchAnnouncementsByClass, postAnnouncement } from "../api/announcementRepo";

interface UseAnnouncementsReturn {
    announcements: Announcement[];
    isLoading: boolean;
    error: string | null;
    loadAnnouncements: () => Promise<void>;
    createAnnouncement: (title: string, body: string, createdBy: string) => Promise<boolean>;
}

export function useAnnouncements(classId: string): UseAnnouncementsReturn {
    const [announcements, setAnnouncements] = useState<Announcement[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const isMounted = useRef(true);
    useEffect(() => {
        return () => { isMounted.current = false; };
    }, []);

    const loadAnnouncements = useCallback(async () => {
        if (!classId) {
            setIsLoading(false);
            return;
        }
        setIsLoading(true);
        setError(null);

        const result = await fetchAnnouncementsByClass(classId);

        if (!isMounted.current) return;

        if (result.error) {
            setError(result.error);
        } else {
            // sort newest first since we cant do it in the query
            const sorted = (result.data ?? []).sort(
                (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            );
            setAnnouncements(sorted);
        }
        setIsLoading(false);
    }, [classId]);

    useEffect(() => {
        loadAnnouncements();
    }, [loadAnnouncements]);

    const createAnnouncement = useCallback(async (title: string, body: string, createdBy: string): Promise<boolean> => {
        const result = await postAnnouncement({ title, body, createdBy, classId });
        if (result.data) {
            await loadAnnouncements();
            return true;
        }
        return false;
    }, [classId, loadAnnouncements]);

    return { announcements, isLoading, error, loadAnnouncements, createAnnouncement };
}
