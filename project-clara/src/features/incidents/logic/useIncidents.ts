// hook for loading and creating incident reports
// sorts by newest first since the graphql index cant do it for us
import { useCallback, useEffect, useRef, useState } from "react";
import {
  Incident,
  fetchIncidentsByClass,
  reportIncident,
} from "../api/incidentRepo";

interface UseIncidentsReturn {
  incidents: Incident[];
  isLoading: boolean;
  error: string | null;
  loadIncidents: () => Promise<void>;
  createIncident: (params: {
    description: string;
    severity: string;
    studentId: string;
    teacherId: string;
    classId: string;
    schoolId: string;
  }) => Promise<boolean>;
}

export function useIncidents(classId: string): UseIncidentsReturn {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const isMounted = useRef(true);
  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  const loadIncidents = useCallback(async () => {
    if (!classId) {
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    setError(null);

    const result = await fetchIncidentsByClass(classId);

    if (!isMounted.current) return;

    if (result.error) {
      setError(result.error);
    } else {
      // sort newest first since we cant do it in the query
      const sorted = (result.data ?? []).sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      setIncidents(sorted);
    }
    setIsLoading(false);
  }, [classId]);

  useEffect(() => {
    loadIncidents();
  }, [loadIncidents]);

  const createIncident = useCallback(
    async (params: {
      description: string;
      severity: string;
      studentId: string;
      teacherId: string;
      classId: string;
      schoolId: string;
    }): Promise<boolean> => {
      // auto set the date to today when creating
      const today = new Date().toISOString().split("T")[0];
      const result = await reportIncident({
        ...params,
        date: today,
      });
      if (result.data) {
        await loadIncidents();
        return true;
      }
      return false;
    },
    [loadIncidents]
  );

  return { incidents, isLoading, error, loadIncidents, createIncident };
}
