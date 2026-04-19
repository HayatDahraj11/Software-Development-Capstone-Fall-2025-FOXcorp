/**
 * AskClaraButton, the primary entry point to Clara from the home screen.
 *
 * Visually distinctive (purple accent, sparkle icon) so parents see it
 * as something new and special, not just another chat thread.
 *
 * Styled without an external gradient dependency so the capstone build
 * stays lean; the solid purple + subtle background tint still reads
 * clearly as "AI feature".
 */

import { Ionicons } from "@expo/vector-icons";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { useThemeColor } from "@/src/features/app-themes/logic/use-theme-color";
import { useParentLoginContext } from "@/src/features/context/ParentLoginContext";
import { useClaraConversation } from "../logic/useClaraConversation";

interface Props {
  compact?: boolean;
}

export default function AskClaraButton({ compact = false }: Props) {
  const { userParent } = useParentLoginContext();
  const parentName = `${userParent.firstName} ${userParent.lastName}`;

  const { openClara, isOpening, error } = useClaraConversation({
    parentId: userParent.userId,
    parentName,
  });

  const cardBg = useThemeColor({}, "cardBackground");
  const textColor = useThemeColor({}, "text");
  const subtextColor = useThemeColor({}, "placeholderText");

  // Clara's signature colour, purple, intentionally fixed across themes so
  // the feature is recognizable.
  const CLARA_PURPLE = "#8b5cf6";
  const CLARA_PURPLE_TINT = "#8b5cf620";

  if (compact) {
    return (
      <Pressable
        onPress={openClara}
        disabled={isOpening}
        style={[
          styles.compactBtn,
          { backgroundColor: cardBg, borderColor: CLARA_PURPLE_TINT },
        ]}
      >
        {isOpening ? (
          <ActivityIndicator color={CLARA_PURPLE} />
        ) : (
          <Ionicons name="sparkles" size={22} color={CLARA_PURPLE} />
        )}
        <Text style={[styles.compactLabel, { color: textColor }]}>
          Ask Clara
        </Text>
      </Pressable>
    );
  }

  return (
    <Pressable
      onPress={openClara}
      disabled={isOpening}
      style={[styles.card, { backgroundColor: cardBg }]}
    >
      <View
        style={[styles.iconCircle, { backgroundColor: CLARA_PURPLE_TINT }]}
      >
        {isOpening ? (
          <ActivityIndicator color={CLARA_PURPLE} />
        ) : (
          <Ionicons name="sparkles" size={22} color={CLARA_PURPLE} />
        )}
      </View>

      <View style={styles.body}>
        <View style={styles.titleRow}>
          <Text style={[styles.title, { color: textColor }]}>Ask Clara</Text>
          <View
            style={[styles.aiBadge, { backgroundColor: CLARA_PURPLE_TINT }]}
          >
            <Text style={[styles.aiBadgeText, { color: CLARA_PURPLE }]}>
              AI
            </Text>
          </View>
        </View>
        <Text style={[styles.subtitle, { color: subtextColor }]}>
          {error
            ? error
            : "Your school assistant, ask about attendance, notes, grades, or a weekly update."}
        </Text>
      </View>

      <Ionicons
        name="chevron-forward"
        size={20}
        color={subtextColor}
        style={styles.chevron}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 14,
    padding: 14,
    marginVertical: 6,
    marginHorizontal: 4,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  body: { flex: 1 },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  title: { fontSize: 16, fontWeight: "600" },
  aiBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  aiBadgeText: { fontSize: 11, fontWeight: "700", letterSpacing: 0.5 },
  subtitle: { fontSize: 13, marginTop: 2 },
  chevron: { marginLeft: 8 },
  compactBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 999,
    borderWidth: 1,
  },
  compactLabel: { fontSize: 14, fontWeight: "600" },
});
