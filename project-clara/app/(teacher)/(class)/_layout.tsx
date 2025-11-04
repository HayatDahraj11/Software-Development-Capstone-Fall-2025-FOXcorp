import { Stack } from "expo-router";

export default function ClassLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      {/* This includes your tab-based screens */}
      <Stack.Screen name="(tabs)" options={{ headerShown: false,  contentStyle: { backgroundColor: "transparent" },}}  />

      {/* This defines your modal presentation */}
      <Stack.Screen
        name="modal"
        options={{
          presentation: "transparentModal",
          headerShown: true,
          title: "Modal",
        }}
      />
    </Stack>
  );
}
