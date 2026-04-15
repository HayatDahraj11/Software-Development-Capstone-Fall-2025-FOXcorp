/**
 * useClaraConversation,ensures the parent has a Clara conversation,
 * creating one lazily on first access.
 *
 * Usage:
 *   const { conversationId, isReady, error, openClara } =
 *     useClaraConversation({ parentId, parentName });
 *
 *   // Somewhere in a button handler:
 *   if (isReady) openClara();
 *
 * Design notes:
 *   - We do NOT eagerly create the conversation on every app launch;
 *     that would create clutter for parents who never use Clara. We
 *     only create it when the user first taps the Ask Clara button.
 *   - Once created, the conversation id is memoized in state so
 *     subsequent opens are instant.
 */

import { useCallback, useState } from "react";
import { useRouter } from "expo-router";
import {
  getOrCreateClaraConversation,
  CLARA_DISPLAY_NAME,
} from "../api/claraRepo";

interface UseClaraConversationParams {
  parentId: string;
  parentName: string;
}

interface UseClaraConversationReturn {
  conversationId: string | null;
  isOpening: boolean;
  error: string | null;
  openClara: () => Promise<void>;
}

export function useClaraConversation({
  parentId,
  parentName,
}: UseClaraConversationParams): UseClaraConversationReturn {
  const router = useRouter();
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [isOpening, setIsOpening] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const openClara = useCallback(async () => {
    setError(null);
    setIsOpening(true);
    try {
      // If we already have it, jump straight to the thread
      if (conversationId) {
        router.push({
          pathname: "/(parent)/conversation",
          params: {
            conversationId,
            conversationTitle: CLARA_DISPLAY_NAME,
          },
        });
        return;
      }

      const { data, error: repoError } = await getOrCreateClaraConversation({
        parentId,
        parentName,
      });

      if (repoError || !data) {
        setError(repoError ?? "Couldn't open Clara.");
        return;
      }

      setConversationId(data.id);
      router.push({
        pathname: "/(parent)/conversation",
        params: {
          conversationId: data.id,
          conversationTitle: CLARA_DISPLAY_NAME,
        },
      });
    } finally {
      setIsOpening(false);
    }
  }, [parentId, parentName, conversationId, router]);

  return { conversationId, isOpening, error, openClara };
}
