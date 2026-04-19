/**
 * claraRepo.ts, app-side repository for the Clara AI assistant.
 *
 * Responsibilities:
 *   1. Tell apart "normal" conversations from Clara conversations by
 *      checking the teacherId against the known Clara bot id.
 *   2. Get-or-create the parent's Clara conversation (one per parent).
 *   3. Fire a request at the Clara Lambda to generate a reply after the
 *      parent sends a message into a Clara conversation.
 *
 * The Lambda endpoint is configured at build time via
 *   EXPO_PUBLIC_CLARA_ENDPOINT
 * so you can point the app at a local dev server during development
 * and at the deployed API Gateway URL in production without code
 * changes.
 */

import { generateClient } from "aws-amplify/api";
import { createConversation } from "@/src/graphql/mutations";
import { conversationsByParentId } from "@/src/graphql/queries";
import type { Conversation } from "@/src/features/messaging/api/messageRepo";

// Constants.

// The Teacher id seeded by scripts/seed-clara.ts. Must match
// CLARA_SENDER_ID in the Lambda. Changing this requires re-seeding.
export const CLARA_BOT_ID = "clara-ai-bot";
export const CLARA_DISPLAY_NAME = "Clara";

// Read at module load so we fail fast in dev if the env var is missing.
const CLARA_ENDPOINT =
  process.env.EXPO_PUBLIC_CLARA_ENDPOINT ??
  "";

// Types.

export interface TriggerClaraResult {
  ok: boolean;
  reply?: string;
  messageId?: string;
  error?: string;
  toolCallsMade?: number;
  elapsedMs?: number;
}

// Lazy init so Amplify.configure() has time to run
let _client: any = null;
function getClient() {
  if (!_client) _client = generateClient();
  return _client;
}

// Identity helpers.

/** Is this conversation a chat with Clara? */
export function isClaraConversation(convo: Conversation): boolean {
  return convo.teacherId === CLARA_BOT_ID;
}

// Conversation creation.

/**
 * Get-or-create the Clara conversation for a parent.
 * There is exactly one Clara thread per parent (DIRECT, no student).
 */
export async function getOrCreateClaraConversation(params: {
  parentId: string;
  parentName: string;
}): Promise<{ data: Conversation | null; error: string | null }> {
  try {
    const existing: any = await getClient().graphql({
      query: conversationsByParentId,
      variables: { parentId: params.parentId },
      authMode: "apiKey",
    });

    const match = (existing.data?.conversationsByParentId?.items ?? []).find(
      (c: Conversation) => c.type === "DIRECT" && c.teacherId === CLARA_BOT_ID
    );
    if (match) return { data: match, error: null };

    const result: any = await getClient().graphql({
      query: createConversation,
      variables: {
        input: {
          type: "DIRECT",
          parentId: params.parentId,
          teacherId: CLARA_BOT_ID,
          parentName: params.parentName,
          teacherName: CLARA_DISPLAY_NAME,
        },
      },
      authMode: "apiKey",
    });
    return { data: result.data.createConversation, error: null };
  } catch (err: any) {
    console.error("getOrCreateClaraConversation failed:", err);
    return {
      data: null,
      error: err?.errors?.[0]?.message ?? "Couldn't start Clara chat.",
    };
  }
}

// Lambda trigger.

/**
 * Kick off Clara's reply generation on the backend.
 *
 * This is intentionally fire-and-forget from the UI's perspective: we
 * don't block the message-send flow on it. Clara's reply appears via
 * the normal onCreateMessage subscription once the Lambda finishes,
 * which takes ~3-8s typically.
 */
export async function triggerClaraReply(params: {
  conversationId: string;
  parentId: string;
  userMessage: string;
}): Promise<TriggerClaraResult> {
  if (!CLARA_ENDPOINT) {
    const msg =
      "EXPO_PUBLIC_CLARA_ENDPOINT is not set. Clara replies are disabled.";
    console.warn(msg);
    return { ok: false, error: msg };
  }

  try {
    const res = await fetch(CLARA_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(params),
    });

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      return {
        ok: false,
        error: `Clara backend HTTP ${res.status}: ${text.slice(0, 200)}`,
      };
    }

    const body = await res.json();
    return {
      ok: !!body.ok,
      reply: body.reply,
      messageId: body.messageId,
      error: body.error,
      toolCallsMade: body.toolCallsMade,
      elapsedMs: body.elapsedMs,
    };
  } catch (err: any) {
    console.warn("triggerClaraReply network error:", err);
    return { ok: false, error: err?.message ?? "Network error." };
  }
}
