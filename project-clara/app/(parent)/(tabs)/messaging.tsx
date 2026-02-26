/**
 * Parent messaging inbox — shows all conversations the parent
 * is part of. Tapping a row opens the conversation thread.
 */

import { RelativePathString, useRouter } from "expo-router";

import { useParentLoginContext } from "@/src/features/context/ParentLoginContext";
import { Conversation } from "@/src/features/messaging/api/messageRepo";
import { useConversations } from "@/src/features/messaging/logic/useConversations";
import ConversationList from "@/src/features/messaging/ui/ConversationList";

export default function ParentMessagingScreen() {
  const { userParent } = useParentLoginContext();
  const router = useRouter();

  const { conversations, isLoading, error, loadConversations } =
    useConversations("parent", userParent.userId);

  const openConversation = (convo: Conversation) => {
    // pass conversationId + a display title as query params
    const title = convo.teacherName ?? "Conversation";
    router.push({
      pathname: ("/(parent)/conversation" as RelativePathString),
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
