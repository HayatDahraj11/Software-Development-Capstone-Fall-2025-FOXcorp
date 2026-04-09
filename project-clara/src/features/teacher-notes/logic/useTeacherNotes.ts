import { useCallback, useEffect, useRef, useState } from "react";
import {
  TeacherNote,
  fetchNotesByStudent,
  createTeacherNote,
  updateTeacherNote,
  deleteTeacherNoteById,
} from "../api/teacherNoteRepo";

interface UseTeacherNotesReturn {
  notes: TeacherNote[];
  isLoading: boolean;
  error: string | null;
  reload: () => Promise<void>;
  addNote: (params: {
    teacherId: string;
    studentId: string;
    classId?: string | null;
    title?: string | null;
    body: string;
    category?: string | null;
  }) => Promise<boolean>;
  editNote: (noteId: string, fields: { title?: string | null; body?: string; category?: string | null }) => Promise<boolean>;
  removeNote: (noteId: string) => Promise<boolean>;
  isSaving: boolean;
}

export function useTeacherNotes(studentId: string): UseTeacherNotesReturn {
  const [notes, setNotes] = useState<TeacherNote[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isMounted = useRef(true);
  useEffect(() => {
    return () => { isMounted.current = false; };
  }, []);

  const load = useCallback(async () => {
    if (!studentId) return;
    setIsLoading(true);
    setError(null);

    const result = await fetchNotesByStudent(studentId);

    if (!isMounted.current) return;

    if (result.error) {
      setError(result.error);
      setNotes([]);
    } else {
      // sort newest first
      const sorted = (result.data ?? []).sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      setNotes(sorted);
    }
    setIsLoading(false);
  }, [studentId]);

  useEffect(() => {
    load();
  }, [load]);

  const addNote = useCallback(async (params: {
    teacherId: string;
    studentId: string;
    classId?: string | null;
    title?: string | null;
    body: string;
    category?: string | null;
  }): Promise<boolean> => {
    setIsSaving(true);
    const result = await createTeacherNote(params);
    if (!isMounted.current) return false;
    setIsSaving(false);

    if (result.data) {
      setNotes(prev => [result.data!, ...prev]);
      return true;
    }
    return false;
  }, []);

  const editNote = useCallback(async (
    noteId: string,
    fields: { title?: string | null; body?: string; category?: string | null }
  ): Promise<boolean> => {
    setIsSaving(true);
    const result = await updateTeacherNote(noteId, fields);
    if (!isMounted.current) return false;
    setIsSaving(false);

    if (result.data) {
      setNotes(prev => prev.map(n => n.id === noteId ? result.data! : n));
      return true;
    }
    return false;
  }, []);

  const removeNote = useCallback(async (noteId: string): Promise<boolean> => {
    setIsSaving(true);
    const result = await deleteTeacherNoteById(noteId);
    if (!isMounted.current) return false;
    setIsSaving(false);

    if (result.data) {
      setNotes(prev => prev.filter(n => n.id !== noteId));
      return true;
    }
    return false;
  }, []);

  return { notes, isLoading, error, reload: load, addNote, editNote, removeNote, isSaving };
}
