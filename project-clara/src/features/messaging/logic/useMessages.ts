/**
 * useMessages — manages the message list for a single conversation.
 *
 * Features:
 * - Loads existing messages on mount
 * - Sets up a real-time AppSync subscription for new messages
 * - Optimistic send: shows the message instantly, swaps for the
 *   confirmed version on success, removes on failure
 * - Deduplication: subscription ignores messages already in state
 */

import { useCallback, useEffect, useRef, useState } from "react";
import {
  Message,
  SenderType,
  client,
  fetchMessages,
  sendMessage as repoSendMessage,
  ON_CREATE_MESSAGE,
} from "../api/messageRepo";

interface UseMessagesParams {
  conversationId: string;
  senderId: string;
  senderType: SenderType;
  senderName: string;
}

interface UseMessagesReturn {
  messages: Message[];
  isLoading: boolean;
  isSending: boolean;
  error: string | null;
  sendMessage: (body: string) => Promise<void>;
}

export function useMessages({
  conversationId,
  senderId,
  senderType,
  senderName,
}: UseMessagesParams): UseMessagesReturn {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isMounted = useRef(true);
  const subscriptionRef = useRef<any>(null);

  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  // load existing messages
  useEffect(() => {
    if (!conversationId) return;

    (async () => {
      setIsLoading(true);
      const result = await fetchMessages(conversationId);
      if (!isMounted.current) return;

      if (result.error) {
        setError(result.error);
      } else {
        setMessages(result.data ?? []);
      }
      setIsLoading(false);
    })();
  }, [conversationId]);

  // real-time subscription for incoming messages
  useEffect(() => {
    if (!conversationId) return;

    try {
      const sub = (client.graphql({
        query: ON_CREATE_MESSAGE,
        variables: {
          filter: { conversationId: { eq: conversationId } },
        },
      }) as any).subscribe({
        next: ({ data }: any) => {
          const incoming: Message = data.onCreateMessage;
          if (!incoming || !isMounted.current) return;

          // skip if we already have this message (from optimistic send)
          setMessages((prev) => {
            if (prev.some((m) => m.id === incoming.id)) return prev;
            return [...prev, incoming];
          });
        },
        error: (err: any) => {
          console.warn("message subscription error:", err);
        },
      });

      subscriptionRef.current = sub;
    } catch (err) {
      console.warn("failed to set up message subscription:", err);
    }

    // clean up subscription on unmount or conversation change
    return () => {
      if (subscriptionRef.current) {
        subscriptionRef.current.unsubscribe();
        subscriptionRef.current = null;
      }
    };
  }, [conversationId]);

  // optimistic send — append immediately, confirm or roll back
  const sendMessage = useCallback(
    async (body: string) => {
      if (!body.trim() || isSending) return;

      const tempId = `temp-${Date.now()}`;
      const tempMessage: Message = {
        id: tempId,
        conversationId,
        senderId,
        senderType,
        senderName,
        body: body.trim(),
        createdAt: new Date().toISOString(),
      };

      // show it right away
      setMessages((prev) => [...prev, tempMessage]);
      setIsSending(true);

      const result = await repoSendMessage({
        conversationId,
        senderId,
        senderType,
        senderName,
        body: body.trim(),
      });

      if (!isMounted.current) return;

      if (result.error || !result.data) {
        // remove the optimistic message on failure
        setMessages((prev) => prev.filter((m) => m.id !== tempId));
        setError(result.error ?? "Send failed.");
      } else {
        // swap temp message for the real one from the backend
        setMessages((prev) =>
          prev.map((m) => (m.id === tempId ? result.data! : m))
        );
      }

      setIsSending(false);
    },
    [conversationId, senderId, senderType, senderName, isSending]
  );

  return { messages, isLoading, isSending, error, sendMessage };
}
