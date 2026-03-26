/**
 * messageRepo.ts — data layer for the messaging feature.
 *
 * Uses the auto-generated GraphQL operations from amplify codegen.
 * All DynamoDB tables (Conversation, Message) are live after amplify push.
 */

import { generateClient } from "aws-amplify/api";

import {
  conversationsByParentId,
  conversationsByTeacherId,
  messagesByConversationIdAndCreatedAt,
  getConversation,
} from "@/src/graphql/queries";

import {
  createConversation,
  createMessage,
  updateConversation,
} from "@/src/graphql/mutations";

import { onCreateMessage } from "@/src/graphql/subscriptions";

import { sendPushToUser } from "@/src/features/notifications/api/sendPushToUser";

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

// Re-export subscription for use in useMessages hook
export const ON_CREATE_MESSAGE = onCreateMessage;

// ── Query helpers ───────────────────────────────────────────────────

/**
 * Fetch all conversations for a parent, sorted newest-first.
 * Uses the byParent GSI generated from @index(name: "byParent").
 */
export async function fetchConversationsByParent(
  parentId: string
): Promise<RepoResult<Conversation[]>> {
  try {
    const result: any = await client.graphql({
      query: conversationsByParentId,
      variables: { parentId },
    });
    const items: Conversation[] =
      result.data?.conversationsByParentId?.items ?? [];
    // sort client-side by last activity
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
 * Uses the byTeacher GSI generated from @index(name: "byTeacher").
 */
export async function fetchConversationsByTeacher(
  teacherId: string
): Promise<RepoResult<Conversation[]>> {
  try {
    const result: any = await client.graphql({
      query: conversationsByTeacherId,
      variables: { teacherId },
    });
    const items: Conversation[] =
      result.data?.conversationsByTeacherId?.items ?? [];
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
    // check if one already exists for this parent
    const existing: any = await client.graphql({
      query: conversationsByParentId,
      variables: { parentId: params.parentId },
    });
    const match = (existing.data?.conversationsByParentId?.items ?? []).find(
      (c: Conversation) =>
        c.type === "DIRECT" &&
        c.teacherId === params.teacherId &&
        c.studentId === params.studentId
    );
    if (match) return { data: match, error: null };

    // none found — create it
    const result: any = await client.graphql({
      query: createConversation,
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
      query: conversationsByTeacherId,
      variables: { teacherId: params.teacherId },
    });
    const match = (existing.data?.conversationsByTeacherId?.items ?? []).find(
      (c: Conversation) => c.type === "GROUP" && c.classId === params.classId
    );
    if (match) return { data: match, error: null };

    const result: any = await client.graphql({
      query: createConversation,
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
 * Uses the byConversation GSI with createdAt as the sort key.
 */
export async function fetchMessages(
  conversationId: string,
  limit: number = 100
): Promise<RepoResult<Message[]>> {
  try {
    const result: any = await client.graphql({
      query: messagesByConversationIdAndCreatedAt,
      variables: {
        conversationId,
        sortDirection: "ASC",
        limit,
      },
    });
    const items: Message[] =
      result.data?.messagesByConversationIdAndCreatedAt?.items ?? [];
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
      query: createMessage,
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
        query: updateConversation,
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

    // send a push notification to the other person so they know they got a message
    // this is fire-and-forget so if it fails the message still goes through fine
    (async () => {
      try {
        // we need the conversation details to figure out who to notify
        const convoResult: any = await client.graphql({
          query: getConversation,
          variables: { id: params.conversationId },
        });
        const convo = convoResult.data?.getConversation;
        if (!convo) return;

        // if a parent sent it, notify the teacher and vice versa
        const recipientId =
          params.senderType === "PARENT" ? convo.teacherId : convo.parentId;
        if (!recipientId) return;

        // build a nice title like "Mrs. Smith - Math Class" or "Jane Doe - Re: Tommy"
        const senderDisplayName = params.senderName;
        const context =
          convo.type === "GROUP"
            ? convo.className ?? "Class"
            : convo.studentName
            ? `Re: ${convo.studentName}`
            : "";

        // the route tells the app where to navigate when they tap the notification
        sendPushToUser({
          recipientUserId: recipientId,
          title: `${senderDisplayName}${context ? ` - ${context}` : ""}`,
          body: params.body,
          data: {
            route:
              params.senderType === "PARENT"
                ? "/(teacher)/conversation"
                : "/(parent)/conversation",
            conversationId: params.conversationId,
            conversationTitle: senderDisplayName,
          },
        });
      } catch (err) {
        // dont let a push failure break the message send
        console.warn("push notification after send failed:", err);
      }
    })();

    return { data: result.data.createMessage, error: null };
  } catch (err) {
    console.error("sendMessage failed:", err);
    return { data: null, error: "Failed to send message." };
  }
}
