/**
 * Teacher messaging inbox — shows all conversations for the teacher.
 */

import { RelativePathString, useRouter } from "expo-router";

import { useTeacherLoginContext } from "@/src/features/context/TeacherLoginContext";
import { Conversation } from "@/src/features/messaging/api/messageRepo";
import { computeUnread } from "@/src/features/messaging/logic/readReceipts";
import { useConversations } from "@/src/features/messaging/logic/useConversations";
import ConversationList from "@/src/features/messaging/ui/ConversationList";

export default function TeacherMessagingScreen() {
  const { userTeacher } = useTeacherLoginContext();
  const router = useRouter();

  const { conversations, isLoading, error, loadConversations } =
    useConversations("teacher", userTeacher.userId);

  const openConversation = (convo: Conversation) => {
    const title =
      convo.type === "GROUP"
        ? convo.className ?? "Group"
        : convo.parentName ?? "Conversation";

    router.push({
      pathname: ("/(teacher)/conversation" as RelativePathString),
      params: { conversationId: convo.id, conversationTitle: title },
    });
  };

  return (
    <ConversationList
      conversations={conversations}
      viewerRole="teacher"
      isLoading={isLoading}
      error={error}
      onSelectConversation={openConversation}
      onRefresh={loadConversations}
      getHasUnread={(c) => computeUnread(c, "teacher")}
    />
  );
}
