import { useCallback, useEffect, useRef, useState } from "react";
import { MedicalRecord, fetchMedicalRecord, createMedicalRecord, updateMedicalRecord } from "../api/medicalRecordRepo";

interface UseMedicalRecordReturn {
  record: MedicalRecord | null;
  isLoading: boolean;
  error: string | null;
  reload: () => Promise<void>;
  saveFields: (fields: {
    allergies?: string | null;
    medications?: string | null;
    conditions?: string | null;
    emergencyNotes?: string | null;
  }) => Promise<boolean>;
  isSaving: boolean;
}

export function useMedicalRecord(studentId: string): UseMedicalRecordReturn {
  const [record, setRecord] = useState<MedicalRecord | null>(null);
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

  const saveFields = useCallback(async (fields: {
    allergies?: string | null;
    medications?: string | null;
    conditions?: string | null;
    emergencyNotes?: string | null;
  }): Promise<boolean> => {
    setIsSaving(true);

    let result;
    if (record?.id) {
      // update existing record
      result = await updateMedicalRecord(record.id, fields);
    } else {
      // no record exists yet — create one
      result = await createMedicalRecord(studentId, fields);
    }

    if (!isMounted.current) return false;
    setIsSaving(false);

    if (result.data) {
      setRecord(result.data);
      return true;
    }
    return false;
  }, [record?.id, studentId]);

  return { record, isLoading, error, reload: load, saveFields, isSaving };
}
