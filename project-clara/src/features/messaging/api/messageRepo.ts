/**
 * messageRepo.ts — data layer for the messaging feature.
 *
 * Uses inline GraphQL strings for now so the team can commit and test
 * the skeleton before anyone runs `amplify push`.
 *
 * TODO: after `amplify push`, replace inline strings with generated
 * imports from @/src/graphql/queries, mutations, subscriptions.
 */

import { generateClient } from "aws-amplify/api";

// ── Types ───────────────────────────────────────────────────────────

export type ConversationType = "DIRECT" | "GROUP";
export type SenderType = "PARENT" | "TEACHER";

export interface Conversation {
  id: string;
  type: ConversationType;
  parentId?: string | null;
  teacherId: string;
  studentId?: string | null;
  classId?: string | null;
  parentName?: string | null;
  teacherName?: string | null;
  studentName?: string | null;
  className?: string | null;
  lastMessageText?: string | null;
  lastMessageAt?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  senderType: SenderType;
  senderName: string;
  body: string;
  createdAt: string;
}

export interface RepoResult<T> {
  data: T | null;
  error: string | null;
}

// ── Client ──────────────────────────────────────────────────────────

export const client = generateClient();

// ── Inline GraphQL ──────────────────────────────────────────────────
// These mirror what `amplify push` would generate. Keep field lists in
// sync with the schema until the generated files are available.

const LIST_CONVERSATIONS_BY_PARENT = /* GraphQL */ `
  query ListConversationsByParent($parentId: ID!) {
    listConversations(filter: { parentId: { eq: $parentId } }) {
      items {
        id type parentId teacherId studentId classId
        parentName teacherName studentName className
        lastMessageText lastMessageAt createdAt updatedAt
      }
    }
  }
`;

const LIST_CONVERSATIONS_BY_TEACHER = /* GraphQL */ `
  query ListConversationsByTeacher($teacherId: ID!) {
    listConversations(filter: { teacherId: { eq: $teacherId } }) {
      items {
        id type parentId teacherId studentId classId
        parentName teacherName studentName className
        lastMessageText lastMessageAt createdAt updatedAt
      }
    }
  }
`;

const LIST_MESSAGES_BY_CONVERSATION = /* GraphQL */ `
  query ListMessagesByConversation($conversationId: ID!, $limit: Int) {
    listMessages(
      filter: { conversationId: { eq: $conversationId } }
      limit: $limit
    ) {
      items {
        id conversationId senderId senderType senderName body createdAt
      }
    }
  }
`;

const CREATE_CONVERSATION = /* GraphQL */ `
  mutation CreateConversation($input: CreateConversationInput!) {
    createConversation(input: $input) {
      id type parentId teacherId studentId classId
      parentName teacherName studentName className
      lastMessageText lastMessageAt createdAt updatedAt
    }
  }
`;

const CREATE_MESSAGE = /* GraphQL */ `
  mutation CreateMessage($input: CreateMessageInput!) {
    createMessage(input: $input) {
      id conversationId senderId senderType senderName body createdAt
    }
  }
`;

const UPDATE_CONVERSATION = /* GraphQL */ `
  mutation UpdateConversation($input: UpdateConversationInput!) {
    updateConversation(input: $input) {
      id lastMessageText lastMessageAt
    }
  }
`;

// Real-time subscription — listens for new messages in a conversation
export const ON_CREATE_MESSAGE = /* GraphQL */ `
  subscription OnCreateMessage($filter: ModelSubscriptionMessageFilterInput) {
    onCreateMessage(filter: $filter) {
      id conversationId senderId senderType senderName body createdAt
    }
  }
`;

// ── Query helpers ───────────────────────────────────────────────────

/**
 * Fetch all conversations for a parent, sorted newest-first.
 */
export async function fetchConversationsByParent(
  parentId: string
): Promise<RepoResult<Conversation[]>> {
  try {
    const result: any = await client.graphql({
      query: LIST_CONVERSATIONS_BY_PARENT,
      variables: { parentId },
    });
    const items: Conversation[] =
      result.data?.listConversations?.items ?? [];
    // sort client-side until GSI sort keys are available
    items.sort(
      (a, b) =>
        new Date(b.lastMessageAt ?? b.createdAt ?? 0).getTime() -
        new Date(a.lastMessageAt ?? a.createdAt ?? 0).getTime()
    );
    return { data: items, error: null };
  } catch (err) {
    console.error("fetchConversationsByParent failed:", err);
    return { data: null, error: "Could not load conversations." };
  }
}

/**
 * Fetch all conversations for a teacher, sorted newest-first.
 */
export async function fetchConversationsByTeacher(
  teacherId: string
): Promise<RepoResult<Conversation[]>> {
  try {
    const result: any = await client.graphql({
      query: LIST_CONVERSATIONS_BY_TEACHER,
      variables: { teacherId },
    });
    const items: Conversation[] =
      result.data?.listConversations?.items ?? [];
    items.sort(
      (a, b) =>
        new Date(b.lastMessageAt ?? b.createdAt ?? 0).getTime() -
        new Date(a.lastMessageAt ?? a.createdAt ?? 0).getTime()
    );
    return { data: items, error: null };
  } catch (err) {
    console.error("fetchConversationsByTeacher failed:", err);
    return { data: null, error: "Could not load conversations." };
  }
}

/**
 * Find an existing DIRECT conversation or create one.
 * App-level uniqueness: (parentId, teacherId, studentId).
 */
export async function getOrCreateDirectConversation(params: {
  parentId: string;
  teacherId: string;
  studentId: string;
  parentName: string;
  teacherName: string;
  studentName: string;
}): Promise<RepoResult<Conversation>> {
  try {
    // check if one already exists
    const existing: any = await client.graphql({
      query: LIST_CONVERSATIONS_BY_PARENT,
      variables: { parentId: params.parentId },
    });
    const match = (existing.data?.listConversations?.items ?? []).find(
      (c: Conversation) =>
        c.type === "DIRECT" &&
        c.teacherId === params.teacherId &&
        c.studentId === params.studentId
    );
    if (match) return { data: match, error: null };

    // none found — create it
    const result: any = await client.graphql({
      query: CREATE_CONVERSATION,
      variables: {
        input: {
          type: "DIRECT",
          parentId: params.parentId,
          teacherId: params.teacherId,
          studentId: params.studentId,
          parentName: params.parentName,
          teacherName: params.teacherName,
          studentName: params.studentName,
        },
      },
    });
    return { data: result.data.createConversation, error: null };
  } catch (err) {
    console.error("getOrCreateDirectConversation failed:", err);
    return { data: null, error: "Could not start conversation." };
  }
}

/**
 * Find an existing GROUP conversation for a class, or create one.
 * App-level uniqueness: (classId, type=GROUP).
 */
export async function getOrCreateGroupConversation(params: {
  teacherId: string;
  classId: string;
  teacherName: string;
  className: string;
}): Promise<RepoResult<Conversation>> {
  try {
    const existing: any = await client.graphql({
      query: LIST_CONVERSATIONS_BY_TEACHER,
      variables: { teacherId: params.teacherId },
    });
    const match = (existing.data?.listConversations?.items ?? []).find(
      (c: Conversation) => c.type === "GROUP" && c.classId === params.classId
    );
    if (match) return { data: match, error: null };

    const result: any = await client.graphql({
      query: CREATE_CONVERSATION,
      variables: {
        input: {
          type: "GROUP",
          teacherId: params.teacherId,
          classId: params.classId,
          teacherName: params.teacherName,
          className: params.className,
        },
      },
    });
    return { data: result.data.createConversation, error: null };
  } catch (err) {
    console.error("getOrCreateGroupConversation failed:", err);
    return { data: null, error: "Could not start group conversation." };
  }
}

/**
 * Fetch messages for a conversation, sorted oldest-first (chat order).
 */
export async function fetchMessages(
  conversationId: string,
  limit: number = 100
): Promise<RepoResult<Message[]>> {
  try {
    const result: any = await client.graphql({
      query: LIST_MESSAGES_BY_CONVERSATION,
      variables: { conversationId, limit },
    });
    const items: Message[] = result.data?.listMessages?.items ?? [];
    // ensure chronological order
    items.sort(
      (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );
    return { data: items, error: null };
  } catch (err) {
    console.error("fetchMessages failed:", err);
    return { data: null, error: "Could not load messages." };
  }
}

/**
 * Send a message and update the conversation's preview fields.
 * The conversation update is fire-and-forget — we don't block on it.
 */
export async function sendMessage(params: {
  conversationId: string;
  senderId: string;
  senderType: SenderType;
  senderName: string;
  body: string;
}): Promise<RepoResult<Message>> {
  try {
    const now = new Date().toISOString();
    const result: any = await client.graphql({
      query: CREATE_MESSAGE,
      variables: {
        input: {
          conversationId: params.conversationId,
          senderId: params.senderId,
          senderType: params.senderType,
          senderName: params.senderName,
          body: params.body,
          createdAt: now,
        },
      },
    });

    // update conversation preview (fire-and-forget)
    client
      .graphql({
        query: UPDATE_CONVERSATION,
        variables: {
          input: {
            id: params.conversationId,
            lastMessageText: params.body,
            lastMessageAt: now,
          },
        },
      })
      .catch((err: any) =>
        console.warn("conversation preview update failed:", err)
      );

    return { data: result.data.createMessage, error: null };
  } catch (err) {
    console.error("sendMessage failed:", err);
    return { data: null, error: "Failed to send message." };
  }
}
