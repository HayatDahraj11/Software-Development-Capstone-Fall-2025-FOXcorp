// hook for loading announcements across all of a parent's children's classes
// aggregates announcements from every class the parent's students are enrolled in
import { useCallback, useEffect, useRef, useState } from "react";
import { Announcement, fetchAnnouncementsByClass } from "../api/announcementRepo";

interface UseParentAnnouncementsReturn {
    announcements: Announcement[];
    isLoading: boolean;
    error: string | null;
    loadAnnouncements: () => Promise<void>;
}

export function useParentAnnouncements(classIds: string[]): UseParentAnnouncementsReturn {
    const [announcements, setAnnouncements] = useState<Announcement[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const isMounted = useRef(true);
    useEffect(() => {
        return () => { isMounted.current = false; };
    }, []);

    const loadAnnouncements = useCallback(async () => {
        if (classIds.length === 0) {
            setIsLoading(false);
            return;
        }
        setIsLoading(true);
        setError(null);

        try {
            // fetch announcements for each class in parallel
            const uniqueIds = [...new Set(classIds)];
            const results = await Promise.all(
                uniqueIds.map((id) => fetchAnnouncementsByClass(id))
            );

            if (!isMounted.current) return;

            // combine all results and sort newest first
            const all: Announcement[] = [];
            for (const result of results) {
                if (result.error) {
                    setError(result.error);
                } else if (result.data) {
                    all.push(...result.data);
                }
            }

            const sorted = all.sort(
                (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            );
            setAnnouncements(sorted);
        } catch (err: any) {
            if (isMounted.current) {
                setError(err?.message ?? "Failed to load announcements");
            }
        }
        setIsLoading(false);
    }, [classIds.join(",")]);

    useEffect(() => {
        loadAnnouncements();
    }, [loadAnnouncements]);

    return { announcements, isLoading, error, loadAnnouncements };
}
