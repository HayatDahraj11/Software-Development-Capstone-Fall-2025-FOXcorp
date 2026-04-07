import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useGlobalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import { useThemeColor } from "@/src/features/app-themes/logic/use-theme-color";
import { useTeacherLoginContext } from "@/src/features/context/TeacherLoginContext";
import { useSchedules } from "@/src/features/schedules/logic/useSchedules";
import {
  DayOfWeek,
  Schedule,
  createSchedule,
  updateScheduleEntry,
  deleteScheduleEntry,
} from "@/src/features/schedules/api/scheduleRepo";

const DAYS: { key: DayOfWeek; label: string; short: string }[] = [
  { key: "MONDAY", label: "Monday", short: "Mon" },
  { key: "TUESDAY", label: "Tuesday", short: "Tue" },
  { key: "WEDNESDAY", label: "Wednesday", short: "Wed" },
  { key: "THURSDAY", label: "Thursday", short: "Thu" },
  { key: "FRIDAY", label: "Friday", short: "Fri" },
  { key: "SATURDAY", label: "Saturday", short: "Sat" },
  { key: "SUNDAY", label: "Sunday", short: "Sun" },
];

const HOURS = Array.from({ length: 14 }, (_, i) => i + 6); // 6 AM - 7 PM
const MINUTES = ["00", "15", "30", "45"];

function formatTime(awsTime: string): string {
  const [h, m] = awsTime.split(":");
  const hour = parseInt(h, 10);
  const ampm = hour >= 12 ? "PM" : "AM";
  const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
  return `${displayHour}:${m} ${ampm}`;
}

function toAWSTime(hour: number, minute: string): string {
  return `${String(hour).padStart(2, "0")}:${minute}:00`;
}

export default function ScheduleManagementScreen() {
  const { classId } = useGlobalSearchParams();
  const classIdStr = Array.isArray(classId) ? classId[0] : classId ?? "";
  const { userClasses } = useTeacherLoginContext();

  const bg = useThemeColor({}, "background");
  const cardBg = useThemeColor({}, "cardBackground");
  const textColor = useThemeColor({}, "text");
  const subtextColor = useThemeColor({}, "placeholderText");
  const tint = useThemeColor({}, "tint");
  const borderColor = useThemeColor({}, "listBorderTranslucent");
  const modalBg = useThemeColor({}, "modalBackground");

  const { schedules, isLoading, error } = useSchedules([classIdStr]);
  const [localSchedules, setLocalSchedules] = useState<Schedule[] | null>(null);
  const displaySchedules = localSchedules ?? schedules;

  // modal state
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [selectedDay, setSelectedDay] = useState<DayOfWeek>("MONDAY");
  const [startHour, setStartHour] = useState(8);
  const [startMin, setStartMin] = useState("00");
  const [endHour, setEndHour] = useState(9);
  const [endMin, setEndMin] = useState("00");
  const [isSaving, setIsSaving] = useState(false);

  const selectedClass = userClasses.find((c) => c.id === classIdStr);

  const openAdd = () => {
    setEditingId(null);
    setSelectedDay("MONDAY");
    setStartHour(8);
    setStartMin("00");
    setEndHour(9);
    setEndMin("00");
    setShowModal(true);
  };

  const openEdit = (sched: Schedule) => {
    setEditingId(sched.id);
    setSelectedDay(sched.dayOfWeek);
    const [sh, sm] = sched.startTime.split(":");
    const [eh, em] = sched.endTime.split(":");
    setStartHour(parseInt(sh, 10));
    setStartMin(sm);
    setEndHour(parseInt(eh, 10));
    setEndMin(em);
    setShowModal(true);
  };

  const handleSave = async () => {
    const start = toAWSTime(startHour, startMin);
    const end = toAWSTime(endHour, endMin);

    if (start >= end) {
      Alert.alert("Invalid Time", "End time must be after start time.");
      return;
    }

    setIsSaving(true);

    if (editingId) {
      const result = await updateScheduleEntry(editingId, {
        dayOfWeek: selectedDay,
        startTime: start,
        endTime: end,
      });
      if (result.data) {
        setLocalSchedules((prev) =>
          (prev ?? schedules).map((s) => (s.id === editingId ? result.data! : s))
        );
        setShowModal(false);
      } else {
        Alert.alert("Error", result.error ?? "Failed to update.");
      }
    } else {
      const result = await createSchedule({
        classId: classIdStr,
        dayOfWeek: selectedDay,
        startTime: start,
        endTime: end,
      });
      if (result.data) {
        setLocalSchedules((prev) => [...(prev ?? schedules), result.data!]);
        setShowModal(false);
      } else {
        Alert.alert("Error", result.error ?? "Failed to create.");
      }
    }
    setIsSaving(false);
  };

  const handleDelete = (sched: Schedule) => {
    Alert.alert(
      "Delete Schedule",
      `Remove ${DAYS.find((d) => d.key === sched.dayOfWeek)?.label} ${formatTime(sched.startTime)} - ${formatTime(sched.endTime)}?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            const result = await deleteScheduleEntry(sched.id);
            if (result.data) {
              setLocalSchedules((prev) =>
                (prev ?? schedules).filter((s) => s.id !== sched.id)
              );
            } else {
              Alert.alert("Error", "Failed to delete schedule entry.");
            }
          },
        },
      ]
    );
  };

  // group by day
  const sortedDays = DAYS.filter((d) =>
    displaySchedules.some((s) => s.dayOfWeek === d.key)
  );
  const ungroupedDays = DAYS.filter(
    (d) => !displaySchedules.some((s) => s.dayOfWeek === d.key)
  );

  if (isLoading) {
    return (
      <View style={[styles.center, { backgroundColor: bg }]}>
        <ActivityIndicator size="large" color={tint} />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: bg }}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.headerRow}>
          <View>
            <Text style={[styles.heading, { color: textColor }]}>
              {selectedClass?.name ?? "Class"} Schedule
            </Text>
            <Text style={[styles.subheading, { color: subtextColor }]}>
              {displaySchedules.length} time {displaySchedules.length === 1 ? "slot" : "slots"}
            </Text>
          </View>
          <Pressable style={[styles.addBtn, { backgroundColor: tint }]} onPress={openAdd}>
            <Ionicons name="add" size={18} color="#fff" />
            <Text style={styles.addBtnText}>Add</Text>
          </Pressable>
        </View>

        {error && (
          <Text style={{ color: "#dc2626", marginBottom: 12 }}>{error}</Text>
        )}

        {displaySchedules.length === 0 ? (
          <View style={[styles.emptyCard, { backgroundColor: cardBg }]}>
            <Ionicons name="calendar-outline" size={48} color={subtextColor} />
            <Text style={[styles.emptyText, { color: subtextColor }]}>
              No schedule entries yet
            </Text>
            <Text style={[styles.emptyHint, { color: subtextColor }]}>
              Tap "Add" to set when this class meets
            </Text>
          </View>
        ) : (
          sortedDays.map((day) => {
            const daySchedules = displaySchedules
              .filter((s) => s.dayOfWeek === day.key)
              .sort((a, b) => a.startTime.localeCompare(b.startTime));

            return (
              <View key={day.key} style={{ marginBottom: 12 }}>
                <Text style={[styles.dayLabel, { color: tint }]}>{day.label}</Text>
                {daySchedules.map((sched) => (
                  <View key={sched.id} style={[styles.schedCard, { backgroundColor: cardBg }]}>
                    <View style={[styles.timeIcon, { backgroundColor: tint + "15" }]}>
                      <Ionicons name="time" size={20} color={tint} />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={[styles.timeText, { color: textColor }]}>
                        {formatTime(sched.startTime)} - {formatTime(sched.endTime)}
                      </Text>
                    </View>
                    <Pressable onPress={() => openEdit(sched)} hitSlop={8} style={{ marginRight: 12 }}>
                      <Ionicons name="pencil" size={16} color={subtextColor} />
                    </Pressable>
                    <Pressable onPress={() => handleDelete(sched)} hitSlop={8}>
                      <Ionicons name="trash-outline" size={16} color="#dc2626" />
                    </Pressable>
                  </View>
                ))}
              </View>
            );
          })
        )}
      </ScrollView>

      {/* Add/Edit Modal */}
      <Modal visible={showModal} transparent animationType="fade" onRequestClose={() => setShowModal(false)}>
        <Pressable style={styles.modalOverlay} onPress={() => setShowModal(false)}>
          <Pressable style={[styles.modalSheet, { backgroundColor: modalBg }]} onPress={(e) => e.stopPropagation()}>
            <Text style={[styles.modalTitle, { color: textColor }]}>
              {editingId ? "Edit Time Slot" : "Add Time Slot"}
            </Text>

            {/* Day picker */}
            <Text style={[styles.fieldLabel, { color: subtextColor }]}>Day</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.dayPicker}>
              {DAYS.map((day) => (
                <Pressable
                  key={day.key}
                  style={[
                    styles.dayChip,
                    { borderColor: tint },
                    selectedDay === day.key && { backgroundColor: tint },
                  ]}
                  onPress={() => setSelectedDay(day.key)}
                >
                  <Text
                    style={[
                      styles.dayChipText,
                      { color: selectedDay === day.key ? "#fff" : tint },
                    ]}
                  >
                    {day.short}
                  </Text>
                </Pressable>
              ))}
            </ScrollView>

            {/* Start time */}
            <Text style={[styles.fieldLabel, { color: subtextColor, marginTop: 16 }]}>Start Time</Text>
            <TimePicker
              hour={startHour}
              minute={startMin}
              onHourChange={setStartHour}
              onMinuteChange={setStartMin}
              tint={tint}
              textColor={textColor}
              cardBg={cardBg}
              borderColor={borderColor}
            />

            {/* End time */}
            <Text style={[styles.fieldLabel, { color: subtextColor, marginTop: 16 }]}>End Time</Text>
            <TimePicker
              hour={endHour}
              minute={endMin}
              onHourChange={setEndHour}
              onMinuteChange={setEndMin}
              tint={tint}
              textColor={textColor}
              cardBg={cardBg}
              borderColor={borderColor}
            />

            <View style={[styles.modalButtons, { marginTop: 20 }]}>
              <Pressable
                style={[styles.modalBtn, { backgroundColor: subtextColor + "20" }]}
                onPress={() => setShowModal(false)}
              >
                <Text style={[styles.modalBtnText, { color: textColor }]}>Cancel</Text>
              </Pressable>
              <Pressable
                style={[styles.modalBtn, { backgroundColor: tint, opacity: isSaving ? 0.5 : 1 }]}
                onPress={handleSave}
                disabled={isSaving}
              >
                <Text style={[styles.modalBtnText, { color: "#fff" }]}>
                  {isSaving ? "Saving..." : "Save"}
                </Text>
              </Pressable>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}

// simple hour/minute picker using scrollable chips
function TimePicker({
  hour,
  minute,
  onHourChange,
  onMinuteChange,
  tint,
  textColor,
  cardBg,
  borderColor,
}: {
  hour: number;
  minute: string;
  onHourChange: (h: number) => void;
  onMinuteChange: (m: string) => void;
  tint: string;
  textColor: string;
  cardBg: string;
  borderColor: string;
}) {
  const ampm = hour >= 12 ? "PM" : "AM";
  const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;

  return (
    <View style={styles.timePickerRow}>
      {/* Hour */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ flex: 1 }}>
        {HOURS.map((h) => {
          const dh = h === 0 ? 12 : h > 12 ? h - 12 : h;
          const ap = h >= 12 ? "PM" : "AM";
          const selected = h === hour;
          return (
            <Pressable
              key={h}
              style={[
                styles.timeChip,
                { borderColor },
                selected && { backgroundColor: tint, borderColor: tint },
              ]}
              onPress={() => onHourChange(h)}
            >
              <Text style={{ fontSize: 13, fontWeight: "600", color: selected ? "#fff" : textColor }}>
                {dh} {ap}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>

      <Text style={{ color: textColor, fontSize: 18, fontWeight: "700", marginHorizontal: 4 }}>:</Text>

      {/* Minute */}
      {MINUTES.map((m) => {
        const selected = m === minute;
        return (
          <Pressable
            key={m}
            style={[
              styles.timeChip,
              { borderColor },
              selected && { backgroundColor: tint, borderColor: tint },
            ]}
            onPress={() => onMinuteChange(m)}
          >
            <Text style={{ fontSize: 13, fontWeight: "600", color: selected ? "#fff" : textColor }}>
              {m}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  content: { padding: 20, paddingBottom: 40 },
  headerRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 20 },
  heading: { fontSize: 22, fontWeight: "700" },
  subheading: { fontSize: 13, marginTop: 2 },
  addBtn: { flexDirection: "row", alignItems: "center", paddingHorizontal: 14, paddingVertical: 8, borderRadius: 10, gap: 4 },
  addBtnText: { fontSize: 14, fontWeight: "600", color: "#fff" },
  emptyCard: { borderRadius: 16, padding: 40, alignItems: "center" },
  emptyText: { fontSize: 16, fontWeight: "600", marginTop: 12 },
  emptyHint: { fontSize: 13, marginTop: 4 },
  dayLabel: { fontSize: 14, fontWeight: "700", letterSpacing: 0.5, marginBottom: 8, marginLeft: 4 },
  schedCard: { flexDirection: "row", alignItems: "center", borderRadius: 12, padding: 14, marginBottom: 8 },
  timeIcon: { width: 36, height: 36, borderRadius: 10, alignItems: "center", justifyContent: "center", marginRight: 12 },
  timeText: { fontSize: 15, fontWeight: "600" },
  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.4)", justifyContent: "center", alignItems: "center" },
  modalSheet: { width: "90%", maxWidth: 420, borderRadius: 16, padding: 24 },
  modalTitle: { fontSize: 20, fontWeight: "700", marginBottom: 16 },
  fieldLabel: { fontSize: 12, fontWeight: "700", letterSpacing: 0.5, marginBottom: 8 },
  dayPicker: { flexDirection: "row" },
  dayChip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 8, borderWidth: 1.5, marginRight: 8 },
  dayChipText: { fontSize: 13, fontWeight: "600" },
  timePickerRow: { flexDirection: "row", alignItems: "center" },
  timeChip: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8, borderWidth: 1, marginRight: 6 },
  modalButtons: { flexDirection: "row", gap: 12 },
  modalBtn: { flex: 1, paddingVertical: 12, borderRadius: 10, alignItems: "center" },
  modalBtnText: { fontSize: 15, fontWeight: "600" },
});
