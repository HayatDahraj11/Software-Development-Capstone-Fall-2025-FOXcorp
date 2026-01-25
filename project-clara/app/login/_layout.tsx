import { useThemeColor } from "@/src/features/app-themes/logic/use-theme-color";
import { Stack } from "expo-router";

export default function RootLayout() {

  return (
    <>
      <Stack screenOptions={{
        headerStyle: {
          backgroundColor: useThemeColor({},"headerBackground")
        },
        headerTitleStyle: {
          color: useThemeColor({},"text")
        },
      }}>
        <Stack.Screen name="index" options={{title: "Login"}}/>
        <Stack.Screen name="school-selection" options={{title: "School Selection"}}/>
      </Stack>
    </>
  )
}
