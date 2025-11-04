import { Stack } from "expo-router";

export default function ClassLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" options={{ headerShown: false,  contentStyle: { backgroundColor: "transparent" },}}  />

      <Stack.Screen
        name="modal"
        options={{
          presentation: "transparentModal",
          headerShown: false,
          title: "Modal",
        }}
      />
    </Stack>
  );
}
