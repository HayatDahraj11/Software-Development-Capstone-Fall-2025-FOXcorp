/**
 * Parent messaging inbox — shows all conversations the parent
 * is part of. Tapping a row opens the conversation thread.
 * FAB opens a teacher picker to start a new conversation.
 */

import { useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { RelativePathString, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import { useParentLoginContext } from "@/src/features/context/ParentLoginContext";
import { Conversation, getOrCreateDirectConversation } from "@/src/features/messaging/api/messageRepo";
import { computeUnread } from "@/src/features/messaging/logic/readReceipts";
import { useConversations } from "@/src/features/messaging/logic/useConversations";
import { useTeacherList, TeacherOption } from "@/src/features/messaging/logic/useTeacherList";
import ConversationList from "@/src/features/messaging/ui/ConversationList";
import NewConversationSheet from "@/src/features/messaging/ui/NewConversationSheet";

export default function ParentMessagingScreen() {
  const { userParent, userStudents } = useParentLoginContext();
  const router = useRouter();
  const [showNewConvo, setShowNewConvo] = useState(false);

  const { conversations, isLoading, error, loadConversations } =
    useConversations("parent", userParent.userId);

  const { teachers } = useTeacherList();

  const openConversation = (convo: Conversation) => {
    const title = convo.teacherName ?? "Conversation";
    router.push({
      pathname: "/(parent)/conversation" as RelativePathString,
      params: { conversationId: convo.id, conversationTitle: title },
    });
  };

  const handleSelectTeacher = async (teacher: TeacherOption) => {
    setShowNewConvo(false);

    const parentName = `${userParent.firstName} ${userParent.lastName}`;

    const result = await getOrCreateDirectConversation({
      parentId: userParent.userId,
      teacherId: teacher.teacherId,
      studentId: teacher.studentId,
      parentName,
      teacherName: teacher.teacherName,
      studentName: teacher.studentName,
    });

    if (result.data) {
      router.push({
        pathname: "/(parent)/conversation" as RelativePathString,
        params: { conversationId: result.data.id, conversationTitle: teacher.teacherName },
      });
      loadConversations();
    }
  };

  return (
    <View style={styles.container}>
      <ConversationList
        conversations={conversations}
        viewerRole="parent"
        isLoading={isLoading}
        error={error}
        onSelectConversation={openConversation}
        onRefresh={loadConversations}
        getHasUnread={(c) => computeUnread(c, "parent")}
      />

      <Pressable style={styles.fab} onPress={() => setShowNewConvo(true)}>
        <Ionicons name="add" size={28} color="#fff" />
      </Pressable>

      <NewConversationSheet
        visible={showNewConvo}
        onClose={() => setShowNewConvo(false)}
        teachers={teachers}
        onSelectTeacher={handleSelectTeacher}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  fab: {
    position: "absolute",
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#0a7ea4",
    alignItems: "center",
    justifyContent: "center",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
});
