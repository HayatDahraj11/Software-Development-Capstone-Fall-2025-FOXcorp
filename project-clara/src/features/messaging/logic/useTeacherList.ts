import { useMemo } from "react";
import { useParentLoginContext } from "@/src/features/context/ParentLoginContext";

export interface TeacherOption {
  teacherId: string;
  teacherName: string;
  studentId: string;
  studentName: string;
  className: string;
}

export function useTeacherList(): { teachers: TeacherOption[]; isLoading: boolean } {
  const { userStudents, userEnrollments, userClasses, userTeachers, isContextLoading } =
    useParentLoginContext();

  const teachers = useMemo(() => {
    const results: TeacherOption[] = [];
    const seen = new Set<string>();

    for (const enrollment of userEnrollments) {
      const cls = userClasses.find((c) => c.id === enrollment.classId);
      if (!cls) continue;

      const teacher = userTeachers.find((t) => t.id === cls.teacherId);
      if (!teacher) continue;

      const student = userStudents.find((s) => s.id === enrollment.studentId);
      if (!student) continue;

      // deduplicate by teacher+student combo
      const key = `${teacher.id}-${student.id}`;
      if (seen.has(key)) continue;
      seen.add(key);

      results.push({
        teacherId: teacher.id,
        teacherName: teacher.name,
        studentId: student.id,
        studentName: `${student.firstName} ${student.lastName}`,
        className: cls.name,
      });
    }

    return results;
  }, [userStudents, userEnrollments, userClasses, userTeachers]);

  return { teachers, isLoading: isContextLoading };
}
