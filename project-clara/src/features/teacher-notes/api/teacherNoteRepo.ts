import { generateClient } from "aws-amplify/api";

// lean mutations avoid @belongsTo resolver errors on nested relations
const createTeacherNoteLean = /* GraphQL */ `mutation CreateTeacherNote($input: CreateTeacherNoteInput!) {
  createTeacherNote(input: $input) {
    id
    teacherId
    studentId
    classId
    title
    body
    category
    createdAt
    updatedAt
  }
}`;

const updateTeacherNoteLean = /* GraphQL */ `mutation UpdateTeacherNote($input: UpdateTeacherNoteInput!) {
  updateTeacherNote(input: $input) {
    id
    teacherId
    studentId
    classId
    title
    body
    category
    createdAt
    updatedAt
  }
}`;

const deleteTeacherNoteLean = /* GraphQL */ `mutation DeleteTeacherNote($input: DeleteTeacherNoteInput!) {
  deleteTeacherNote(input: $input) {
    id
  }
}`;

const teacherNotesByStudentId = /* GraphQL */ `query TeacherNotesByStudentId(
  $studentId: ID!
  $sortDirection: ModelSortDirection
  $limit: Int
  $nextToken: String
) {
  teacherNotesByStudentId(
    studentId: $studentId
    sortDirection: $sortDirection
    limit: $limit
    nextToken: $nextToken
  ) {
    items {
      id
      teacherId
      studentId
      classId
      title
      body
      category
      createdAt
      updatedAt
    }
    nextToken
  }
}`;

let _client: any = null;
function getClient() {
    if (!_client) _client = generateClient();
    return _client;
}

export interface TeacherNote {
  id: string;
  teacherId: string;
  studentId: string;
  classId?: string | null;
  title?: string | null;
  body: string;
  category?: string | null;
  createdAt: string;
  updatedAt?: string | null;
}

export interface RepoResult<T> {
  data: T | null;
  error: string | null;
}

export async function fetchNotesByStudent(
  studentId: string
): Promise<RepoResult<TeacherNote[]>> {
  try {
    const result: any = await getClient().graphql({
      query: teacherNotesByStudentId,
      variables: { studentId },
      authMode: "apiKey",
    });
    const items: TeacherNote[] =
      result?.data?.teacherNotesByStudentId?.items ?? [];
    return { data: items, error: null };
  } catch (err: any) {
    if (err?.data?.teacherNotesByStudentId?.items) {
      return { data: err.data.teacherNotesByStudentId.items, error: null };
    }
    console.error("fetchNotesByStudent failed:", JSON.stringify(err, null, 2));
    const msg = err?.errors?.[0]?.message ?? err?.message ?? "Failed to fetch notes";
    return { data: null, error: msg };
  }
}

export async function createTeacherNote(params: {
  teacherId: string;
  studentId: string;
  classId?: string | null;
  title?: string | null;
  body: string;
  category?: string | null;
}): Promise<RepoResult<TeacherNote>> {
  try {
    const result: any = await getClient().graphql({
      query: createTeacherNoteLean,
      variables: {
        input: {
          teacherId: params.teacherId,
          studentId: params.studentId,
          classId: params.classId ?? null,
          title: params.title ?? null,
          body: params.body,
          category: params.category ?? "GENERAL",
        },
      },
      authMode: "apiKey",
    });
    return { data: result.data.createTeacherNote, error: null };
  } catch (err: any) {
    if (err?.data?.createTeacherNote) {
      return { data: err.data.createTeacherNote, error: null };
    }
    console.error("createTeacherNote failed:", JSON.stringify(err, null, 2));
    const msg = err?.errors?.[0]?.message ?? err?.message ?? "Failed to create note";
    return { data: null, error: msg };
  }
}

export async function updateTeacherNote(
  noteId: string,
  fields: { title?: string | null; body?: string; category?: string | null }
): Promise<RepoResult<TeacherNote>> {
  try {
    const result: any = await getClient().graphql({
      query: updateTeacherNoteLean,
      variables: { input: { id: noteId, ...fields } },
      authMode: "apiKey",
    });
    return { data: result.data.updateTeacherNote, error: null };
  } catch (err: any) {
    if (err?.data?.updateTeacherNote) {
      return { data: err.data.updateTeacherNote, error: null };
    }
    console.error("updateTeacherNote failed:", JSON.stringify(err, null, 2));
    const msg = err?.errors?.[0]?.message ?? err?.message ?? "Failed to update note";
    return { data: null, error: msg };
  }
}

export async function deleteTeacherNoteById(
  noteId: string
): Promise<RepoResult<{ id: string }>> {
  try {
    const result: any = await getClient().graphql({
      query: deleteTeacherNoteLean,
      variables: { input: { id: noteId } },
      authMode: "apiKey",
    });
    return { data: result.data.deleteTeacherNote, error: null };
  } catch (err: any) {
    if (err?.data?.deleteTeacherNote) {
      return { data: err.data.deleteTeacherNote, error: null };
    }
    console.error("deleteTeacherNote failed:", JSON.stringify(err, null, 2));
    const msg = err?.errors?.[0]?.message ?? err?.message ?? "Failed to delete note";
    return { data: null, error: msg };
  }
}
