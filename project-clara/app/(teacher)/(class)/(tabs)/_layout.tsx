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
                //headerShown: false,
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
                name="announcements"
                options={{
                    title: "Announcements",
                    tabBarLabel: "Announcements",
                    tabBarIcon: ({color, focused}) => (
                        <Ionicons name = {focused ? 'megaphone' : 'megaphone-outline'} color={color} size={24} />
                    )
            }} />
            <Tabs.Screen
                name="class"
                options={{
                    title: "Class Home",
                    tabBarLabel: "Home",
                    tabBarIcon: ({color, focused}) => (
                        <Ionicons name = {focused ? 'home' : 'home-outline'} color = {color} size={24} />
                    ),
            }} />
            <Tabs.Screen
                name="attendance-list"
                options={{
                    title: "Attendance",
                    tabBarLabel: "Attendance",
                    tabBarIcon: ({color, focused}) => (
                        <Ionicons name = {focused ? 'map' : 'map-outline'} color = {color} size={24} />
                    ),
            }} />

            <Tabs.Screen
                name="attendance-map"
                options={{
                    href: null,
                    title: "Attendance",
                    tabBarLabel: "Attendance",
                    tabBarIcon: ({color, focused}) => (
                        <Ionicons name = {focused ? 'map' : 'map-outline'} color = {color} size={24} />
                    ),
            }} />

            <Tabs.Screen
                name="grades"
                options={{
                    title: "Grades",
                    tabBarLabel: "Grades",
                    tabBarIcon: ({color, focused}) => (
                        <Ionicons name = {focused ? 'ellipsis-horizontal-sharp' : 'ellipsis-horizontal-outline'} color = {color} size={24} />
                    ),
            }} />
        </Tabs>
    )
}