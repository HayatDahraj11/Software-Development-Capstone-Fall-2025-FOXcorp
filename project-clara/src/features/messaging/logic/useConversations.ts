/**
 * useConversations — fetches and manages the conversation list
 * for either a parent or teacher user.
 *
 * Exposes loadConversations() so screens can call it on mount
 * and again on pull-to-refresh.
 */

import { useCallback, useEffect, useRef, useState } from "react";
import {
  Conversation,
  client,
  fetchConversationsByParent,
  fetchConversationsByTeacher,
  ON_UPDATE_CONVERSATION,
} from "../api/messageRepo";

interface UseConversationsReturn {
  conversations: Conversation[];
  isLoading: boolean;
  error: string | null;
  loadConversations: () => Promise<void>;
}

export function useConversations(
  role: "parent" | "teacher",
  userId: string
): UseConversationsReturn {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // prevent state updates after unmount
  const isMounted = useRef(true);
  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  const loadConversations = useCallback(async () => {
    if (!userId) return;
    setIsLoading(true);
    setError(null);

    const result =
      role === "parent"
        ? await fetchConversationsByParent(userId)
        : await fetchConversationsByTeacher(userId);

    if (!isMounted.current) return;

    if (result.error) {
      setError(result.error);
    } else {
      setConversations(result.data ?? []);
    }
    setIsLoading(false);
  }, [role, userId]);

  // fetch on mount
  useEffect(() => {
    loadConversations();
  }, [loadConversations]);

  // live updates so unread dots clear without a manual refresh
  useEffect(() => {
    if (!userId) return;
    let sub: any;
    try {
      sub = (client.graphql({
        query: ON_UPDATE_CONVERSATION,
        variables: {
          filter:
            role === "parent"
              ? { parentId: { eq: userId } }
              : { teacherId: { eq: userId } },
        },
      }) as any).subscribe({
        next: ({ data }: any) => {
          const updated: Conversation | undefined = data?.onUpdateConversation;
          if (!updated || !isMounted.current) return;
          setConversations((prev) =>
            prev.map((c) => (c.id === updated.id ? { ...c, ...updated } : c))
          );
        },
        error: (err: any) =>
          console.warn("conversation update sub error:", err),
      });
    } catch (err) {
      console.warn("failed to set up conversation sub:", err);
    }
    return () => {
      sub?.unsubscribe?.();
    };
  }, [role, userId]);

  return { conversations, isLoading, error, loadConversations };
}
