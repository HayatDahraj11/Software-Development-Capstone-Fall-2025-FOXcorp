// hook for managing attendance in a class
// loads all records on mount, filters for today, and lets you mark students
// if a student already has a record for today it updates it instead of making a dupe
import { useCallback, useEffect, useRef, useState } from "react";
import {
  AttendanceRecord,
  AttendanceStatus,
  changeAttendance,
  fetchAttendanceByClass,
  submitAttendance,
} from "../api/attendanceRepo";

interface UseAttendanceReturn {
  records: AttendanceRecord[];
  isLoading: boolean;
  isSaving: boolean;
  error: string | null;
  loadAttendance: () => Promise<void>;
  saveAttendanceForStudent: (
    studentId: string,
    status: AttendanceStatus
  ) => Promise<boolean>;
  getTodayStatus: (studentId: string) => AttendanceStatus | null;
  getTodayRecordId: (studentId: string) => string | null;
}

export function useAttendance(
  classId: string,
  date?: string
): UseAttendanceReturn {
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isMounted = useRef(true);
  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  // defaults to today but you can pass a different date if needed
  const today = date ?? new Date().toISOString().split("T")[0];

  const loadAttendance = useCallback(async () => {
    if (!classId) return;
    setIsLoading(true);
    setError(null);

    const result = await fetchAttendanceByClass(classId);

    if (!isMounted.current) return;

    if (result.error) {
      setError(result.error);
    } else {
      setRecords(result.data ?? []);
    }
    setIsLoading(false);
  }, [classId]);

  useEffect(() => {
    loadAttendance();
  }, [loadAttendance]);

  // only care about today's records for the status buttons
  const todayRecords = records.filter((r) => r.date === today);

  const getTodayStatus = useCallback(
    (studentId: string): AttendanceStatus | null => {
      const rec = todayRecords.find((r) => r.studentId === studentId);
      return rec?.status ?? null;
    },
    [todayRecords]
  );

  const getTodayRecordId = useCallback(
    (studentId: string): string | null => {
      const rec = todayRecords.find((r) => r.studentId === studentId);
      return rec?.id ?? null;
    },
    [todayRecords]
  );

  const saveAttendanceForStudent = useCallback(
    async (studentId: string, status: AttendanceStatus): Promise<boolean> => {
      setIsSaving(true);
      // check if this student already got marked today
      const existingId = getTodayRecordId(studentId);

      let result;
      if (existingId) {
        // already marked, just update the status
        result = await changeAttendance({ id: existingId, status });
      } else {
        result = await submitAttendance({
          studentId,
          classId,
          date: today,
          status,
        });
      }

      if (!isMounted.current) {
        setIsSaving(false);
        return false;
      }

      if (result.data) {
        await loadAttendance();
        setIsSaving(false);
        return true;
      }
      if (result.error) {
        setError(result.error);
      }
      setIsSaving(false);
      return false;
    },
    [classId, today, getTodayRecordId, loadAttendance]
  );

  return {
    records,
    isLoading,
    isSaving,
    error,
    loadAttendance,
    saveAttendanceForStudent,
    getTodayStatus,
    getTodayRecordId,
  };
}
