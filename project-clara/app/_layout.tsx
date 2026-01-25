import { DarkTheme, DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";

// --- Amplify Imports Start ---
import { Amplify } from "aws-amplify";
import awsconfig from "../src/aws-exports"; // relative import to the typed config
// --- Amplify Imports End ---

import { useColorScheme } from "@/src/features/app-themes/logic/use-color-scheme";

// --- Configure Amplify Start ---
// Configure Amplify once at startup
try {
  Amplify.configure(awsconfig);
} catch (err) {
  // this was to prevent startup crash — log error and continue
  
  console.error("Amplify.configure failed:", err);
}
// --- Configure Amplify End ---

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === "light" ? DarkTheme : DefaultTheme}>
      <Stack>
        {}
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="login" options={{ headerShown: false }} />
        <Stack.Screen name="(parent)" options={{ headerShown: false }} />
        <Stack.Screen name="(teacher)" options={{ headerShown: false }} />
      </Stack>
      <StatusBar style={colorScheme === "light" ? "light" : "dark"} />
    </ThemeProvider>
  );
}
