// teacher schedule management — full CRUD for class time slots
// uses inline overlay instead of RN Modal to avoid web pointer-event issues
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
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
import { useTeacherSchedule } from "@/src/features/schedules/logic/useTeacherSchedule";
import { DayOfWeek, Schedule } from "@/src/features/schedules/api/scheduleRepo";

const DAYS: { key: DayOfWeek; label: string; short: string }[] = [
  { key: "MONDAY", label: "Monday", short: "Mon" },
  { key: "TUESDAY", label: "Tuesday", short: "Tue" },
  { key: "WEDNESDAY", label: "Wednesday", short: "Wed" },
  { key: "THURSDAY", label: "Thursday", short: "Thu" },
  { key: "FRIDAY", label: "Friday", short: "Fri" },
  { key: "SATURDAY", label: "Saturday", short: "Sat" },
  { key: "SUNDAY", label: "Sunday", short: "Sun" },
];

const HOURS = Array.from({ length: 14 }, (_, i) => i + 6); // 6 AM through 7 PM
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

// checks if two time ranges overlap (both in HH:mm:ss format)
function timesOverlap(
  startA: string,
  endA: string,
  startB: string,
  endB: string
): boolean {
  return startA < endB && startB < endA;
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

  const {
    schedules,
    isLoading,
    error,
    isSaving,
    addEntry,
    editEntry,
    removeEntry,
  } = useTeacherSchedule(classIdStr);

  // form state
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [selectedDay, setSelectedDay] = useState<DayOfWeek>("MONDAY");
  const [startHour, setStartHour] = useState(8);
  const [startMin, setStartMin] = useState("00");
  const [endHour, setEndHour] = useState(9);
  const [endMin, setEndMin] = useState("00");

  const selectedClass = userClasses.find((c) => c.id === classIdStr);

  const openAdd = () => {
    setEditingId(null);
    setSelectedDay("MONDAY");
    setStartHour(8);
    setStartMin("00");
    setEndHour(9);
    setEndMin("00");
    setShowForm(true);
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
    setShowForm(true);
  };

  const closeForm = () => setShowForm(false);

  const handleSave = async () => {
    const start = toAWSTime(startHour, startMin);
    const end = toAWSTime(endHour, endMin);

    if (start >= end) {
      Alert.alert("Invalid Time", "End time must be after start time.");
      return;
    }

    // check for overlapping slots on the same day
    const conflicting = schedules.find(
      (s) =>
        s.dayOfWeek === selectedDay &&
        s.id !== editingId &&
        timesOverlap(start, end, s.startTime, s.endTime)
    );
    if (conflicting) {
      Alert.alert(
        "Time Conflict",
        `This overlaps with an existing slot on ${DAYS.find((d) => d.key === selectedDay)?.label}: ${formatTime(conflicting.startTime)} - ${formatTime(conflicting.endTime)}`
      );
      return;
    }

    let success: boolean;
    if (editingId) {
      success = await editEntry(editingId, {
        dayOfWeek: selectedDay,
        startTime: start,
        endTime: end,
      });
    } else {
      success = await addEntry({
        dayOfWeek: selectedDay,
        startTime: start,
        endTime: end,
      });
    }

    if (success) {
      closeForm();
    } else {
      Alert.alert("Error", "Failed to save. Please try again.");
    }
  };

  const handleDelete = (sched: Schedule) => {
    const dayLabel = DAYS.find((d) => d.key === sched.dayOfWeek)?.label;
    Alert.alert(
      "Delete Time Slot",
      `Remove ${dayLabel} ${formatTime(sched.startTime)} - ${formatTime(sched.endTime)}?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            const ok = await removeEntry(sched.id);
            if (!ok) Alert.alert("Error", "Failed to delete. Please try again.");
          },
        },
      ]
    );
  };

  // group schedules by day, only show days that have entries
  const sortedDays = DAYS.filter((d) =>
    schedules.some((s) => s.dayOfWeek === d.key)
  );

  // count total slots
  const slotCount = schedules.length;
  const dayCount = new Set(schedules.map((s) => s.dayOfWeek)).size;

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
        {/* Header */}
        <View style={styles.headerRow}>
          <View style={{ flex: 1 }}>
            <Text style={[styles.heading, { color: textColor }]}>
              {selectedClass?.name ?? "Class"} Schedule
            </Text>
            <Text style={[styles.subheading, { color: subtextColor }]}>
              {slotCount === 0
                ? "No time slots yet"
                : `${slotCount} ${slotCount === 1 ? "slot" : "slots"} across ${dayCount} ${dayCount === 1 ? "day" : "days"}`}
            </Text>
          </View>
          <Pressable
            style={[styles.addBtn, { backgroundColor: tint }]}
            onPress={openAdd}
          >
            <Ionicons name="add" size={18} color="#fff" />
            <Text style={styles.addBtnText}>Add</Text>
          </Pressable>
        </View>

        {error && (
          <View style={[styles.errorBar, { backgroundColor: "#fef2f2" }]}>
            <Ionicons name="alert-circle" size={16} color="#dc2626" />
            <Text style={{ color: "#dc2626", fontSize: 13, flex: 1 }}>{error}</Text>
          </View>
        )}

        {/* Empty state */}
        {slotCount === 0 && (
          <View style={[styles.emptyCard, { backgroundColor: cardBg }]}>
            <View style={[styles.emptyIconCircle, { backgroundColor: tint + "15" }]}>
              <Ionicons name="calendar-outline" size={40} color={tint} />
            </View>
            <Text style={[styles.emptyTitle, { color: textColor }]}>
              No Schedule Set
            </Text>
            <Text style={[styles.emptyHint, { color: subtextColor }]}>
              Add time slots to define when this class meets.{"\n"}Parents will
              see these on their schedule screen.
            </Text>
            <Pressable
              style={[styles.emptyAddBtn, { backgroundColor: tint }]}
              onPress={openAdd}
            >
              <Ionicons name="add" size={18} color="#fff" />
              <Text style={{ color: "#fff", fontSize: 15, fontWeight: "600", marginLeft: 6 }}>
                Add First Time Slot
              </Text>
            </Pressable>
          </View>
        )}

        {/* Schedule entries grouped by day */}
        {sortedDays.map((day) => {
          const daySchedules = schedules
            .filter((s) => s.dayOfWeek === day.key)
            .sort((a, b) => a.startTime.localeCompare(b.startTime));

          return (
            <View key={day.key} style={{ marginBottom: 16 }}>
              <View style={styles.dayHeader}>
                <View style={[styles.dayDot, { backgroundColor: tint }]} />
                <Text style={[styles.dayLabel, { color: tint }]}>
                  {day.label}
                </Text>
                <Text style={[styles.dayCount, { color: subtextColor }]}>
                  {daySchedules.length} {daySchedules.length === 1 ? "slot" : "slots"}
                </Text>
              </View>

              {daySchedules.map((sched) => (
                <Pressable
                  key={sched.id}
                  style={({ pressed }) => [
                    styles.schedCard,
                    { backgroundColor: cardBg, opacity: pressed ? 0.85 : 1 },
                  ]}
                  onPress={() => openEdit(sched)}
                >
                  <View style={[styles.timeIcon, { backgroundColor: tint + "15" }]}>
                    <Ionicons name="time" size={20} color={tint} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.timeText, { color: textColor }]}>
                      {formatTime(sched.startTime)} - {formatTime(sched.endTime)}
                    </Text>
                    <Text style={{ fontSize: 11, color: subtextColor, marginTop: 2 }}>
                      Tap to edit
                    </Text>
                  </View>
                  <Pressable
                    onPress={() => handleDelete(sched)}
                    hitSlop={10}
                    style={[styles.deleteBtn, { backgroundColor: "#dc262610" }]}
                  >
                    <Ionicons name="trash-outline" size={16} color="#dc2626" />
                  </Pressable>
                </Pressable>
              ))}
            </View>
          );
        })}
      </ScrollView>

      {/* Inline overlay form — avoids RN Modal web pointer-event bugs */}
      {showForm && (
        <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
          <Pressable style={styles.overlay} onPress={closeForm}>
            <Pressable
              style={[styles.formSheet, { backgroundColor: modalBg }]}
              onPress={(e) => e.stopPropagation()}
            >
              <View style={styles.formHeader}>
                <Text style={[styles.formTitle, { color: textColor }]}>
                  {editingId ? "Edit Time Slot" : "New Time Slot"}
                </Text>
                <Pressable onPress={closeForm} hitSlop={10}>
                  <Ionicons name="close" size={22} color={subtextColor} />
                </Pressable>
              </View>

              {/* Day picker */}
              <Text style={[styles.fieldLabel, { color: subtextColor }]}>DAY</Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={{ marginBottom: 16 }}
              >
                {DAYS.map((day) => {
                  const isSelected = selectedDay === day.key;
                  return (
                    <Pressable
                      key={day.key}
                      style={[
                        styles.dayChip,
                        { borderColor: isSelected ? tint : borderColor },
                        isSelected && { backgroundColor: tint },
                      ]}
                      onPress={() => setSelectedDay(day.key)}
                    >
                      <Text
                        style={[
                          styles.dayChipText,
                          { color: isSelected ? "#fff" : textColor },
                        ]}
                      >
                        {day.short}
                      </Text>
                    </Pressable>
                  );
                })}
              </ScrollView>

              {/* Start time */}
              <Text style={[styles.fieldLabel, { color: subtextColor }]}>
                START TIME
              </Text>
              <TimePicker
                hour={startHour}
                minute={startMin}
                onHourChange={setStartHour}
                onMinuteChange={setStartMin}
                tint={tint}
                textColor={textColor}
                borderColor={borderColor}
              />

              {/* End time */}
              <Text style={[styles.fieldLabel, { color: subtextColor, marginTop: 14 }]}>
                END TIME
              </Text>
              <TimePicker
                hour={endHour}
                minute={endMin}
                onHourChange={setEndHour}
                onMinuteChange={setEndMin}
                tint={tint}
                textColor={textColor}
                borderColor={borderColor}
              />

              {/* Time preview */}
              <View style={[styles.previewRow, { backgroundColor: tint + "10", borderColor: tint + "30" }]}>
                <Ionicons name="time-outline" size={16} color={tint} />
                <Text style={{ color: tint, fontSize: 14, fontWeight: "600", marginLeft: 8 }}>
                  {DAYS.find((d) => d.key === selectedDay)?.label},{" "}
                  {formatTime(toAWSTime(startHour, startMin))} -{" "}
                  {formatTime(toAWSTime(endHour, endMin))}
                </Text>
              </View>

              {/* Buttons */}
              <View style={styles.formButtons}>
                <Pressable
                  style={[styles.formBtn, { backgroundColor: subtextColor + "20" }]}
                  onPress={closeForm}
                >
                  <Text style={[styles.formBtnText, { color: textColor }]}>
                    Cancel
                  </Text>
                </Pressable>
                <Pressable
                  style={[
                    styles.formBtn,
                    { backgroundColor: tint, opacity: isSaving ? 0.5 : 1 },
                  ]}
                  onPress={handleSave}
                  disabled={isSaving}
                >
                  <Text style={[styles.formBtnText, { color: "#fff" }]}>
                    {isSaving ? "Saving..." : editingId ? "Update" : "Add Slot"}
                  </Text>
                </Pressable>
              </View>
            </Pressable>
          </Pressable>
        </View>
      )}
    </View>
  );
}

// scrollable hour + minute chip picker
function TimePicker({
  hour,
  minute,
  onHourChange,
  onMinuteChange,
  tint,
  textColor,
  borderColor,
}: {
  hour: number;
  minute: string;
  onHourChange: (h: number) => void;
  onMinuteChange: (m: string) => void;
  tint: string;
  textColor: string;
  borderColor: string;
}) {
  return (
    <View style={styles.timePickerRow}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{ flex: 1 }}
      >
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
              <Text
                style={{
                  fontSize: 13,
                  fontWeight: "600",
                  color: selected ? "#fff" : textColor,
                }}
              >
                {dh} {ap}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>

      <Text
        style={{
          color: textColor,
          fontSize: 18,
          fontWeight: "700",
          marginHorizontal: 4,
        }}
      >
        :
      </Text>

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
            <Text
              style={{
                fontSize: 13,
                fontWeight: "600",
                color: selected ? "#fff" : textColor,
              }}
            >
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
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  heading: { fontSize: 22, fontWeight: "700" },
  subheading: { fontSize: 13, marginTop: 2 },
  addBtn: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
    gap: 4,
  },
  addBtnText: { fontSize: 14, fontWeight: "600", color: "#fff" },
  errorBar: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    padding: 12,
    borderRadius: 10,
    marginBottom: 12,
  },
  emptyCard: {
    borderRadius: 16,
    padding: 32,
    alignItems: "center",
  },
  emptyIconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  emptyTitle: { fontSize: 18, fontWeight: "700", marginBottom: 8 },
  emptyHint: { fontSize: 14, textAlign: "center", lineHeight: 20 },
  emptyAddBtn: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
  },
  dayHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    marginLeft: 4,
    gap: 8,
  },
  dayDot: { width: 8, height: 8, borderRadius: 4 },
  dayLabel: { fontSize: 15, fontWeight: "700", letterSpacing: 0.3 },
  dayCount: { fontSize: 12 },
  schedCard: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 12,
    padding: 14,
    marginBottom: 8,
  },
  timeIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  timeText: { fontSize: 15, fontWeight: "600" },
  deleteBtn: {
    width: 34,
    height: 34,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  // inline overlay styles (same pattern as teacher notes)
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 100,
  },
  formSheet: {
    width: "90%",
    maxWidth: 420,
    borderRadius: 16,
    padding: 24,
    maxHeight: "85%",
  },
  formHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  formTitle: { fontSize: 20, fontWeight: "700" },
  fieldLabel: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1,
    marginBottom: 8,
  },
  dayChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1.5,
    marginRight: 8,
  },
  dayChipText: { fontSize: 13, fontWeight: "600" },
  timePickerRow: { flexDirection: "row", alignItems: "center", marginBottom: 4 },
  timeChip: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    marginRight: 6,
  },
  previewRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    marginTop: 16,
    marginBottom: 20,
  },
  formButtons: { flexDirection: "row", gap: 12 },
  formBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  formBtnText: { fontSize: 15, fontWeight: "600" },
});
