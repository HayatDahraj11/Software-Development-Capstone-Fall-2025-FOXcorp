import {
  FlatList,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { useThemeColor } from "@/src/features/app-themes/logic/use-theme-color";
import { TeacherOption } from "../logic/useTeacherList";

interface Props {
  visible: boolean;
  onClose: () => void;
  teachers: TeacherOption[];
  onSelectTeacher: (teacher: TeacherOption) => void;
}

export default function NewConversationSheet({
  visible,
  onClose,
  teachers,
  onSelectTeacher,
}: Props) {
  const bgColor = useThemeColor({}, "background");
  const cardBg = useThemeColor({}, "cardBackground");
  const textColor = useThemeColor({}, "text");
  const subtextColor = useThemeColor({}, "placeholderText");
  const borderColor = useThemeColor({}, "listBorderTranslucent");

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={[styles.sheet, { backgroundColor: bgColor }]}>
          <View style={[styles.header, { borderBottomColor: borderColor }]}>
            <Text style={[styles.title, { color: textColor }]}>New Conversation</Text>
            <Pressable onPress={onClose}>
              <Text style={[styles.closeBtn, { color: subtextColor }]}>Cancel</Text>
            </Pressable>
          </View>

          {teachers.length === 0 ? (
            <View style={styles.empty}>
              <Text style={{ color: subtextColor, fontSize: 16 }}>No teachers found</Text>
            </View>
          ) : (
            <FlatList
              data={teachers}
              keyExtractor={(item) => `${item.teacherId}-${item.studentId}`}
              renderItem={({ item }) => (
                <Pressable
                  style={[styles.row, { borderBottomColor: borderColor }]}
                  onPress={() => onSelectTeacher(item)}
                >
                  <Text style={[styles.teacherName, { color: textColor }]}>
                    {item.teacherName}
                  </Text>
                  <Text style={[styles.detail, { color: subtextColor }]}>
                    {item.className} — {item.studentName}
                  </Text>
                </Pressable>
              )}
            />
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "flex-end",
  },
  sheet: {
    maxHeight: "70%",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingBottom: 32,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
  },
  closeBtn: {
    fontSize: 16,
  },
  empty: {
    padding: 32,
    alignItems: "center",
  },
  row: {
    padding: 16,
    borderBottomWidth: 1,
  },
  teacherName: {
    fontSize: 16,
    fontWeight: "600",
  },
  detail: {
    fontSize: 14,
    marginTop: 4,
  },
});
