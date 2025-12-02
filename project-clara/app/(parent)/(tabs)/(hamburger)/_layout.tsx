import { Stack } from "expo-router";

export default function HamburgerLayout() {
    return (
        <Stack>
            <Stack.Screen name="account_settings" options={{title: "Account Settings"}}/>
            <Stack.Screen name="notification_settings" options={{title: "Notification Settings"}}/>
            <Stack.Screen name="settings" options={{title: "Settings"}}/>
        </Stack>
        
    )
}