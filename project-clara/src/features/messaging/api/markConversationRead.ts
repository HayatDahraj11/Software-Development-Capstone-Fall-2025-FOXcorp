/**
 * Stamp the viewer's lastReadAt on a conversation.
 *
 * Lives in its own file (rather than messageRepo.ts) so it can be unit-
 * tested in isolation. See __tests__/messaging/markConversationRead.test.ts.
 *
 * Fire and forget: writes only the side-specific field so it cant collide
 * with sendMessage's preview update which writes lastMessageText/At only.
 */
import { generateClient } from "aws-amplify/api";
import { updateConversation } from "@/src/graphql/mutations";

let _client: any = null;
function getClient() {
  if (!_client) _client = generateClient();
  return _client;
}

export async function markConversationRead(params: {
  conversationId: string;
  viewerRole: "parent" | "teacher";
}): Promise<void> {
  if (!params.conversationId) return;
  const now = new Date().toISOString();
  const field =
    params.viewerRole === "parent" ? "parentLastReadAt" : "teacherLastReadAt";
  try {
    await getClient().graphql({
      query: updateConversation,
      variables: {
        input: { id: params.conversationId, [field]: now } as any,
      },
    });
  } catch (err) {
    // non fatal, just skip the receipt this time
    console.warn("markConversationRead failed:", err);
  }
}
