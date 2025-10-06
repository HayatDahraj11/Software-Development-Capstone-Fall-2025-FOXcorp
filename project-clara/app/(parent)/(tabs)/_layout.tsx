import { Ionicons } from "@expo/vector-icons";
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
                    tabBarIcon: ({color, focused}) => (
                        <Ionicons name = {focused ? 'chatbubble-ellipses' : 'chatbubble-ellipses-outline'} color = {color} size={24} />
                    ),
            }} />
            <Tabs.Screen
                name="live-updates"
                options={{
                    title: "Live Updates",
                    tabBarLabel: "Live Updates",
                    tabBarIcon: ({color, focused}) => (
                        <Ionicons name = {focused ? 'map' : 'map-outline'} color={color} size={24} />
                    )
            }} />
            <Tabs.Screen
                name="index"
                options={{
                    title: "Home",
                    tabBarLabel: "Home",
                    tabBarIcon: ({color, focused}) => (
                        <Ionicons name = {focused ? 'home' : 'home-outline'} color = {color} size={24} />
                    ),
            }} />
            <Tabs.Screen
                name="general-info"
                options={{
                    title: "General Student Info",
                    tabBarLabel: "Student Info",
                    tabBarIcon: ({color, focused}) => (
                        <Ionicons name = {focused ? 'bag-handle' : 'bag-handle-outline'} color = {color} size={24} />
                    ),
            }} />
            <Tabs.Screen
                name="hamburger"
                options={{
                    title: "And More...",
                    tabBarLabel: "More",
                    tabBarIcon: ({color, focused}) => (
                        <Ionicons name = {focused ? 'ellipsis-horizontal-sharp' : 'ellipsis-horizontal-outline'} color = {color} size={24} />
                    ),
            }} />
        </Tabs>
    )
}