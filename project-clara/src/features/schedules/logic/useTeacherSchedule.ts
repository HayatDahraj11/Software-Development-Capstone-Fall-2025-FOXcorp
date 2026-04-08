// hook for teacher-side schedule management with full CRUD and optimistic state
// follows same pattern as useTeacherNotes — local state updated immediately,
// server call in background, rollback on failure
import { useCallback, useEffect, useRef, useState } from "react";
import {
  DayOfWeek,
  Schedule,
  fetchSchedulesByClass,
  createSchedule,
  updateScheduleEntry,
  deleteScheduleEntry,
} from "../api/scheduleRepo";

interface UseTeacherScheduleReturn {
  schedules: Schedule[];
  isLoading: boolean;
  error: string | null;
  isSaving: boolean;
  reload: () => Promise<void>;
  addEntry: (params: {
    dayOfWeek: DayOfWeek;
    startTime: string;
    endTime: string;
  }) => Promise<boolean>;
  editEntry: (
    scheduleId: string,
    fields: { dayOfWeek?: DayOfWeek; startTime?: string; endTime?: string }
  ) => Promise<boolean>;
  removeEntry: (scheduleId: string) => Promise<boolean>;
}

export function useTeacherSchedule(classId: string): UseTeacherScheduleReturn {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isMounted = useRef(true);
  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  const load = useCallback(async () => {
    if (!classId) return;
    setIsLoading(true);
    setError(null);

    const result = await fetchSchedulesByClass(classId);

    if (!isMounted.current) return;

    if (result.error) {
      setError(result.error);
    } else {
      setSchedules(result.data ?? []);
    }
    setIsLoading(false);
  }, [classId]);

  useEffect(() => {
    load();
  }, [load]);

  const addEntry = useCallback(
    async (params: {
      dayOfWeek: DayOfWeek;
      startTime: string;
      endTime: string;
    }): Promise<boolean> => {
      setIsSaving(true);

      const result = await createSchedule({ classId, ...params });

      if (!isMounted.current) return false;
      setIsSaving(false);

      if (result.data) {
        setSchedules((prev) => [...prev, result.data!]);
        return true;
      }
      return false;
    },
    [classId]
  );

  const editEntry = useCallback(
    async (
      scheduleId: string,
      fields: { dayOfWeek?: DayOfWeek; startTime?: string; endTime?: string }
    ): Promise<boolean> => {
      setIsSaving(true);

      // optimistic update
      const prev = schedules;
      setSchedules((curr) =>
        curr.map((s) => (s.id === scheduleId ? { ...s, ...fields } : s))
      );

      const result = await updateScheduleEntry(scheduleId, fields);

      if (!isMounted.current) return false;
      setIsSaving(false);

      if (result.data) {
        setSchedules((curr) =>
          curr.map((s) => (s.id === scheduleId ? result.data! : s))
        );
        return true;
      }
      // rollback on failure
      setSchedules(prev);
      return false;
    },
    [schedules]
  );

  const removeEntry = useCallback(
    async (scheduleId: string): Promise<boolean> => {
      setIsSaving(true);

      // optimistic remove
      const prev = schedules;
      setSchedules((curr) => curr.filter((s) => s.id !== scheduleId));

      const result = await deleteScheduleEntry(scheduleId);

      if (!isMounted.current) return false;
      setIsSaving(false);

      if (result.data) return true;
      // rollback on failure
      setSchedules(prev);
      return false;
    },
    [schedules]
  );

  return {
    schedules,
    isLoading,
    error,
    isSaving,
    reload: load,
    addEntry,
    editEntry,
    removeEntry,
  };
}
