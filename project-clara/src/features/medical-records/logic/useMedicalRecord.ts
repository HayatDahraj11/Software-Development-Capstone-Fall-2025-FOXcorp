import { useCallback, useEffect, useRef, useState } from "react";
import { MedicalRecord, fetchMedicalRecord } from "../api/medicalRecordRepo";

interface UseMedicalRecordReturn {
  record: MedicalRecord | null;
  isLoading: boolean;
  error: string | null;
}

export function useMedicalRecord(studentId: string): UseMedicalRecordReturn {
  const [record, setRecord] = useState<MedicalRecord | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const isMounted = useRef(true);
  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  const load = useCallback(async () => {
    if (!studentId) return;
    setIsLoading(true);
    setError(null);

    const result = await fetchMedicalRecord(studentId);

    if (!isMounted.current) return;

    if (result.error) {
      setError(result.error);
    } else {
      setRecord(result.data);
    }
    setIsLoading(false);
  }, [studentId]);

  useEffect(() => {
    load();
  }, [load]);

  return { record, isLoading, error };
}
