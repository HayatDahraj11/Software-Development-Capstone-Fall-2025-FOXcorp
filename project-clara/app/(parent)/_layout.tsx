import { ParentLoginProvider } from "context/ParentLoginContext";
import { Stack } from "expo-router";

export default function ParentLayout() {
    return (
        // login context for parent views
        // see context/ParentLoginContext.js
        <ParentLoginProvider>
            <Stack>
                <Stack.Screen name="index" options={{headerShown: false}}/>
                <Stack.Screen name="(tabs)" options={{headerShown: false}}/>
            </Stack>
        </ParentLoginProvider>
        
    )
}