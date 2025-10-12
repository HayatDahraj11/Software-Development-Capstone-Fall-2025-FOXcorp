import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

export default function RootLayout() {

  return (
    <>
      <Stack>
        <Stack.Screen name="index" options={{title: "Jump to View"}}/>
        <Stack.Screen name="(parent)" options={{headerShown: false}}/>
        <Stack.Screen name="(teacher)" options={{headerShown: false}}/>
        <Stack.Screen name="login" options={{headerShown: false}}/>
      </Stack>
      <StatusBar style="auto"/>
    </>
  )
}
