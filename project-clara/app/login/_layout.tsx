import { Stack } from "expo-router";

export default function RootLayout() {

  return (
    <>
      <Stack>
        <Stack.Screen name="index" options={{title: "Login"}}/>
        <Stack.Screen name="school-selection" options={{title: "School Selection"}}/>
        <Stack.Screen name="signup" options={{title: "Signup TEST"}}/>
      </Stack>
    </>
  )
}
