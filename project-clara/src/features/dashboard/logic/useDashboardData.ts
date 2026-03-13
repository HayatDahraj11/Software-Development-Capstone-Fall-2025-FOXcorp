import { useCallback, useEffect, useRef, useState } from "react";
import { Student } from "src/features/fetch-user-data/api/parent_data_fetcher";
import { fetchConversationsByParent, Conversation } from "@/src/features/messaging/api/messageRepo";
import { fetchMedicalRecord } from "@/src/features/medical-records/api/medicalRecordRepo";

interface DashboardData {
  latestConversation: Conversation | null;
  messageCount: number;
  medicalAlert: string | null;
  isLoading: boolean;
}

export function useDashboardData(parentId: string, students: Student[]): DashboardData {
  const [latestConversation, setLatestConversation] = useState<Conversation | null>(null);
  const [messageCount, setMessageCount] = useState(0);
  const [medicalAlert, setMedicalAlert] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isMounted = useRef(true);
  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  const load = useCallback(async () => {
    if (!parentId) return;
    setIsLoading(true);

    try {
      const convoResult = await fetchConversationsByParent(parentId);
      if (isMounted.current && convoResult.data) {
        setMessageCount(convoResult.data.length);
        setLatestConversation(convoResult.data.length > 0 ? convoResult.data[0] : null);
      }
    } catch {
      // graceful fallback — dashboard still renders
    }

    try {
      if (students.length > 0) {
        const medResult = await fetchMedicalRecord(students[0].id);
        if (isMounted.current && medResult.data?.allergies) {
          setMedicalAlert(medResult.data.allergies);
        }
      }
    } catch {
      // graceful fallback
    }

    if (isMounted.current) setIsLoading(false);
  }, [parentId, students]);

  useEffect(() => {
    load();
  }, [load]);

  return { latestConversation, messageCount, medicalAlert, isLoading };
}
