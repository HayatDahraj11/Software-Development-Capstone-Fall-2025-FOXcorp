import { Tabs } from "expo-router";

import { Colors } from "@/constants/theme";

export default function ParentTabLayout() {
    {/* tabs are shown in the bottom bar
        tab pages are located within the same folder as this _layout file
        index is always the default first page loaded */}

    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: Colors.light.tabIconSelected,
                headerStyle: {
                    backgroundColor: Colors.light.background,
                },
                headerShadowVisible: false,
                headerTintColor: Colors.light.text,
                tabBarStyle: {
                    backgroundColor: Colors.light.background
                },
            }}
        >
            <Tabs.Screen
                name="messaging"
                options={{
                    title: "Messages",
                    tabBarLabel: "Messages",
            }} />
            <Tabs.Screen
                name="live-updates"
                options={{
                    title: "Live Updates",
                    tabBarLabel: "Live Updates",
            }} />
            <Tabs.Screen
                name="index"
                options={{
                    title: "Home",
                    tabBarLabel: "Home",
            }} />
            <Tabs.Screen
                name="general-info"
                options={{
                    title: "General Student Info",
                    tabBarLabel: "Student Info",
            }} />
            <Tabs.Screen
                name="hamburger"
                options={{
                    title: "And More...",
                    tabBarLabel: "More",
            }} />
        </Tabs>
    )
}