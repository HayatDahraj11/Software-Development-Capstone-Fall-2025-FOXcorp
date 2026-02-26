/**
 * Parent messaging inbox — shows all conversations the parent
 * is part of. Tapping a row opens the conversation thread.
 */

import { useRouter } from "expo-router";

import { useParentLoginContext } from "@/src/features/context/ParentLoginContext";
import { useConversations } from "@/src/features/messaging/logic/useConversations";
import ConversationList from "@/src/features/messaging/ui/ConversationList";
import { Conversation } from "@/src/features/messaging/api/messageRepo";

export default function ParentMessagingScreen() {
  const { userParent } = useParentLoginContext();
  const router = useRouter();

  const { conversations, isLoading, error, loadConversations } =
    useConversations("parent", userParent.userId);

  const openConversation = (convo: Conversation) => {
    // pass conversationId + a display title as query params
    const title = convo.teacherName ?? "Conversation";
    router.push({
      pathname: "/(parent)/conversation",
      params: { conversationId: convo.id, conversationTitle: title },
    });
  };

  return (
    <ConversationList
      conversations={conversations}
      viewerRole="parent"
      isLoading={isLoading}
      error={error}
      onSelectConversation={openConversation}
      onRefresh={loadConversations}
    />
  );
}
