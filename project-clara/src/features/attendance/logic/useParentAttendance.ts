// hook for loading a student's attendance records on the parent side
// fetches by studentId and sorts newest first
import { useCallback, useEffect, useRef, useState } from "react";
import { AttendanceRecord, fetchAttendanceByStudent } from "../api/attendanceRepo";

interface UseParentAttendanceReturn {
    records: AttendanceRecord[];
    isLoading: boolean;
    error: string | null;
}

export function useParentAttendance(studentId: string): UseParentAttendanceReturn {
    const [records, setRecords] = useState<AttendanceRecord[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const isMounted = useRef(true);
    useEffect(() => {
        return () => { isMounted.current = false; };
    }, []);

    const load = useCallback(async () => {
        if (!studentId) {
            setIsLoading(false);
            return;
        }
        setIsLoading(true);
        setError(null);

        const result = await fetchAttendanceByStudent(studentId);

        if (!isMounted.current) return;

        if (result.error) {
            setError(result.error);
        } else {
            const sorted = (result.data ?? []).sort(
                (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
            );
            setRecords(sorted);
        }
        setIsLoading(false);
    }, [studentId]);

    useEffect(() => {
        load();
    }, [load]);

    return { records, isLoading, error };
}
