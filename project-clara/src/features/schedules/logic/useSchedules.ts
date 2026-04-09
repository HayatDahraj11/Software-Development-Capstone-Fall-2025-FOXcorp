// hook that takes an array of classIds and fetches all their schedules in parallel
// used on the parent schedule screen so we can show times for every class at once
import { useCallback, useEffect, useRef, useState } from "react";
import { Schedule, fetchSchedulesByClass } from "../api/scheduleRepo";

interface UseSchedulesReturn {
  schedules: Schedule[];
  isLoading: boolean;
  error: string | null;
  reload: () => Promise<void>;
}

export function useSchedules(classIds: string[]): UseSchedulesReturn {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const isMounted = useRef(true);
  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  const loadSchedules = useCallback(async () => {
    if (classIds.length === 0) {
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    setError(null);

    try {
      // fire off all the fetches at the same time, way faster than doing them one by one
      const results = await Promise.all(
        classIds.map((id) => fetchSchedulesByClass(id))
      );

      if (!isMounted.current) return;

      const allSchedules: Schedule[] = [];
      for (const r of results) {
        if (r.data) allSchedules.push(...r.data);
      }
      setSchedules(allSchedules);
    } catch {
      if (isMounted.current) setError("Failed to load schedules");
    }
    if (isMounted.current) setIsLoading(false);
  // joining ids into a string so useCallback actually knows when to re-run
  }, [classIds.join(",")]);

  useEffect(() => {
    loadSchedules();
  }, [loadSchedules]);

  return { schedules, isLoading, error, reload: loadSchedules };
}
