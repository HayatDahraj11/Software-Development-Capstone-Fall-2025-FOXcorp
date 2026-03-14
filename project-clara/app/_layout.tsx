import { ThemeProvider } from "@react-navigation/native";
import { PortalHost } from "@rn-primitives/portal";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";

// --- Amplify Imports Start ---
import { Amplify } from "aws-amplify";
import awsconfig from "../src/aws-exports"; // relative import to the typed config
// --- Amplify Imports End ---

import "@/global.css";
import { AppThemeProvider } from "@/src/features/app-themes/logic/ThemeContext";
//import { useColorScheme } from "@/src/features/app-themes/logic/use-color-scheme";
import { NAV_THEME } from "@/lib/theme";
import { useColorScheme } from "nativewind";

// --- Configure Amplify Start ---
// Configure Amplify once at startup
try {
  Amplify.configure(awsconfig);
} catch (err) {
  // this was to prevent startup crash — log error and continue

  console.error("Amplify.configure failed:", err);
}
// --- Configure Amplify End ---

function RootLayoutInner() {
  const {colorScheme} = useColorScheme();

  return (
    <ThemeProvider value={NAV_THEME[colorScheme ?? 'light']}>
      <Stack>
        {}
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="login" options={{ headerShown: false }} />
        <Stack.Screen name="(parent)" options={{ headerShown: false }} />
        <Stack.Screen name="(teacher)" options={{ headerShown: false }} />
      </Stack>
      <StatusBar style={colorScheme === "light" ? "dark" : "light"} />
      <PortalHost />
    </ThemeProvider>
  );
}

export default function RootLayout() {
  return (
    <AppThemeProvider>
      <RootLayoutInner />
    </AppThemeProvider>
  );
}
