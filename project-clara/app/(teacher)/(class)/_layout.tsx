import { Stack } from "expo-router";
import { useTeacherLoginContext } from "@/src/features/context/TeacherLoginContext";

export default function ClassLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      {/* This includes your tab-based screens */}
      <Stack.Screen name="(tabs)" options={{ headerShown: false,  contentStyle: { backgroundColor: "transparent" },}}  />

      {/* Student detail screen — slides up from bottom */}
      <Stack.Screen
        name="modal"
        options={{
          headerShown: false,
          animation: "slide_from_bottom",
        }}
      />
    </Stack>
  );
}
