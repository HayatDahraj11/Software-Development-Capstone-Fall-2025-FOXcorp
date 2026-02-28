/**
 * MessageBubble — renders a single chat message.
 *
 * Own messages sit on the right with a tinted background.
 * Other people's messages sit on the left with the card background,
 * and show senderName above the bubble (useful in group chats).
 */

import { StyleSheet, Text, View } from "react-native";

import { useThemeColor } from "@/src/features/app-themes/logic/use-theme-color";
import { Message } from "../api/messageRepo";

interface Props {
  message: Message;
  currentUserId: string;
}

/** Short time label, e.g. "3:04 PM" */
function formatTime(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
}

export default function MessageBubble({ message, currentUserId }: Props) {
  const isOwn = message.senderId === currentUserId;

  const cardBg = useThemeColor({}, "cardBackground");
  const textColor = useThemeColor({}, "text");
  const subtextColor = useThemeColor({}, "placeholderText");

  // own messages use the app's tint color
  const ownBubbleBg = "#0a7ea4";

  const styles = StyleSheet.create({
    wrapper: {
      flexDirection: "row",
      justifyContent: isOwn ? "flex-end" : "flex-start",
      paddingHorizontal: 12,
      marginVertical: 4,
    },
    bubble: {
      maxWidth: "78%",
      paddingVertical: 10,
      paddingHorizontal: 14,
      borderRadius: 18,
      backgroundColor: isOwn ? ownBubbleBg : cardBg,
      // slightly different corner radius so bubbles feel directional
      borderBottomRightRadius: isOwn ? 4 : 18,
      borderBottomLeftRadius: isOwn ? 18 : 4,
    },
    senderName: {
      fontSize: 12,
      fontWeight: "600",
      color: subtextColor,
      marginBottom: 2,
    },
    body: {
      fontSize: 15,
      color: isOwn ? "#ffffff" : textColor,
      lineHeight: 20,
    },
    time: {
      fontSize: 11,
      color: isOwn ? "rgba(255,255,255,0.7)" : subtextColor,
      marginTop: 4,
      alignSelf: "flex-end",
    },
  });

  return (
    <View style={styles.wrapper}>
      <View style={styles.bubble}>
        {/* show sender name on other people's messages (group chats) */}
        {!isOwn && (
          <Text style={styles.senderName}>{message.senderName}</Text>
        )}
        <Text style={styles.body}>{message.body}</Text>
        <Text style={styles.time}>{formatTime(message.createdAt)}</Text>
      </View>
    </View>
  );
}
