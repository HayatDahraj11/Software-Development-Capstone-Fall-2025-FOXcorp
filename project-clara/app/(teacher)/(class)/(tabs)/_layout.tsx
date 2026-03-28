import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { useTeacherLoginContext } from "@/src/features/context/TeacherLoginContext";

import { useThemeColor } from "@/src/features/app-themes/logic/use-theme-color";
import { useLocalSearchParams } from "expo-router";

export default function ParentTabLayout() {
    {/* tabs are shown in the bottom bar
        tab pages are located within the same folder as this _layout file
        index is always the default first page loaded */}
    

    const {
        userTeacher,
        userClasses,
    } = useTeacherLoginContext();


    const { classId } = useLocalSearchParams();

    const selectedClass = userClasses?.find(
    c => String(c.id) === String(classId)
    );

    const className = selectedClass?.name ?? "Class";

    return (
        <Tabs
            screenOptions={{
                //headerShown: false,
                tabBarActiveTintColor: useThemeColor({}, "tabIconSelected"),
                headerStyle: {
                    backgroundColor: useThemeColor({}, "headerBackground"),
                    borderBottomColor: useThemeColor({}, "listBorderTranslucent"),
                    borderBottomWidth: 1,
                },
                headerShadowVisible: false,
                headerTintColor: useThemeColor({}, "text"),
                tabBarStyle: {
                    backgroundColor: useThemeColor({}, "background")
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
                    title: className,
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
                name="take-attendance"
                options={{
                    href: null,
                    title: "Take Attendance",
            }} />

            <Tabs.Screen
                name="incidents"
                options={{
                    href: null,
                    title: "Incidents",
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

            <Tabs.Screen
                name="hamburger"
                options={{
                    title: "More",
                    tabBarLabel: "More",
                    tabBarIcon: ({color, focused}) => (
                        <Ionicons name = {focused ? 'ellipsis-horizontal-sharp' : 'ellipsis-horizontal-outline'} color = {color} size={24} />
                    ),
            }} />

            <Tabs.Screen
                name="index"
                options={{
                    href: null,
                    title: "More",
                    tabBarLabel: "More",
                    tabBarIcon: ({color, focused}) => (
                        <Ionicons name = {focused ? 'ellipsis-horizontal-sharp' : 'ellipsis-horizontal-outline'} color = {color} size={24} />
                    ),
            }} />

            <Tabs.Screen 
                name="(hamburger)"
                options={{
                    headerShown: false,
                    href: null,
                }}
            />

        </Tabs>
    )
}