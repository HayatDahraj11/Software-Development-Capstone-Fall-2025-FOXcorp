import { Stack } from "expo-router";
import { ParentLoginProvider } from "context/ParentLoginContext"

export default function ParentLayout() {
    return (
        // login context for parent views
        // see context/ParentLoginContext.js
        <ParentLoginProvider>
            <Stack>
                <Stack.Screen name="(tabs)" options={{headerShown: false}}/>
            </Stack>
        </ParentLoginProvider>
        
    )
}