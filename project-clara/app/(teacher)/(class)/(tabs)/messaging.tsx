/**
 * Teacher messaging inbox — shows all conversations for the teacher.
 *
 * TODO: Replace PLACEHOLDER_TEACHER_ID with actual teacher ID once
 * TeacherLoginContext is expanded to expose teacher.id and currentClass.id.
 * Right now it only has isDebug/updateIsDebug.
 */

import { RelativePathString, useRouter } from "expo-router";

import { Conversation } from "@/src/features/messaging/api/messageRepo";
import { useConversations } from "@/src/features/messaging/logic/useConversations";
import ConversationList from "@/src/features/messaging/ui/ConversationList";

// TODO: pull from TeacherLoginContext once it exposes teacher data
const PLACEHOLDER_TEACHER_ID = "teacher-debug-001";

export default function TeacherMessagingScreen() {
  const router = useRouter();

  const { conversations, isLoading, error, loadConversations } =
    useConversations("teacher", PLACEHOLDER_TEACHER_ID);

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
    />
  );
}
