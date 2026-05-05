/**
 * Pure rules for read-receipts UI. No I/O, no React, no side effects.
 * Kept separate so they can be unit-tested independently of the components.
 */
import type { Conversation, Message } from "../api/messageRepo";

/**
 * Should this conversation row show the unread dot for this viewer?
 *
 * Rule:
 *   - GROUP threads on the parent side: always false in v1 (no per-parent
 *     read tracking yet, see READ_RECEIPTS.md §"group threads").
 *   - No lastMessageAt at all (empty thread): false.
 *   - viewer has never opened the thread (lastReadAt is null/undefined)
 *     AND the thread has any message: true.
 *   - lastMessageAt > viewer's lastReadAt: true.
 *   - otherwise: false.
 */
export function computeUnread(
  conversation: Conversation,
  viewerRole: "parent" | "teacher"
): boolean {
  if (viewerRole === "parent" && conversation.type === "GROUP") return false;
  if (!conversation.lastMessageAt) return false;
  const myLastRead =
    viewerRole === "parent"
      ? conversation.parentLastReadAt
      : conversation.teacherLastReadAt;
  if (!myLastRead) return true;
  return conversation.lastMessageAt > myLastRead;
}

/**
 * Should this bubble render the "Seen" label?
 *
 * Rule:
 *   - Only on own messages.
 *   - Only on the latest own message in the thread (avoid a wall of "Seen").
 *   - Only when otherLastReadAt is non-null AND >= the message createdAt.
 */
export function computeSeen(params: {
  message: Pick<Message, "createdAt" | "senderId">;
  currentUserId: string;
  isLastOwnMessage: boolean;
  otherLastReadAt: string | null;
}): boolean {
  const { message, currentUserId, isLastOwnMessage, otherLastReadAt } = params;
  if (message.senderId !== currentUserId) return false;
  if (!isLastOwnMessage) return false;
  if (otherLastReadAt === null) return false;
  return new Date(message.createdAt).getTime() <=
    new Date(otherLastReadAt).getTime();
}
