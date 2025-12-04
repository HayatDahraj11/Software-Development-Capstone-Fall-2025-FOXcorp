import { Tabs } from "expo-router";

export default function HamburgerLayout() {
    return (
        <Tabs 
            screenOptions={({route}) => ({
            tabBarStyle: {
                display: "none",
            }
        })}>
            <Tabs.Screen name="index" options={{headerShown: false, href: null}}/>
            <Tabs.Screen name="account_settings" options={{title: "Account Settings"}}/>
            <Tabs.Screen name="notification_settings" options={{title: "Notification Settings"}}/>
            <Tabs.Screen name="settings" options={{title: "Settings"}}/>
        </Tabs>
        
    )
}