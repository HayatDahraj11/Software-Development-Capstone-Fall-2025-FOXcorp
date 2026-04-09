import { useCallback, useEffect, useRef, useState } from "react";
import { Student } from "src/features/fetch-user-data/api/parent_data_fetcher";
import { fetchConversationsByParent, Conversation } from "@/src/features/messaging/api/messageRepo";
import { fetchMedicalRecord } from "@/src/features/medical-records/api/medicalRecordRepo";
import { fetchAttendanceByStudent } from "@/src/features/attendance/api/attendanceRepo";
import { fetchIncidentsByStudent } from "@/src/features/incidents/api/incidentRepo";

interface DashboardData {
  latestConversation: Conversation | null;
  messageCount: number;
  medicalAlert: string | null;
  recentAbsences: number;
  incidentCount: number;
  isLoading: boolean;
}

export function useDashboardData(parentId: string, students: Student[]): DashboardData {
  const [latestConversation, setLatestConversation] = useState<Conversation | null>(null);
  const [messageCount, setMessageCount] = useState(0);
  const [medicalAlert, setMedicalAlert] = useState<string | null>(null);
  const [recentAbsences, setRecentAbsences] = useState(0);
  const [incidentCount, setIncidentCount] = useState(0);
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

    // count absences in the last 7 days across all students
    try {
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      const cutoff = sevenDaysAgo.toISOString().split("T")[0];

      let totalAbsences = 0;
      for (const stu of students) {
        const attResult = await fetchAttendanceByStudent(stu.id);
        if (attResult.data) {
          totalAbsences += attResult.data.filter(
            (r) => r.status === "ABSENT" && r.date >= cutoff
          ).length;
        }
      }
      if (isMounted.current) setRecentAbsences(totalAbsences);
    } catch {
      // graceful fallback
    }

    // count total incidents across all students
    try {
      let totalIncidents = 0;
      for (const stu of students) {
        const incResult = await fetchIncidentsByStudent(stu.id);
        if (incResult.data) {
          totalIncidents += incResult.data.length;
        }
      }
      if (isMounted.current) setIncidentCount(totalIncidents);
    } catch {
      // graceful fallback
    }

    if (isMounted.current) setIsLoading(false);
  }, [parentId, students]);

  useEffect(() => {
    load();
  }, [load]);

  return { latestConversation, messageCount, medicalAlert, recentAbsences, incidentCount, isLoading };
}
