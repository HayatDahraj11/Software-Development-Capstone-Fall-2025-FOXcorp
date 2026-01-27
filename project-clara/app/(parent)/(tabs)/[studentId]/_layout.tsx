import { useThemeColor } from "@/src/features/app-themes/logic/use-theme-color";
import { Tabs } from "expo-router";

export default function ParentGenInfoStudentIDLayout() {

    const headerBackgroundColor = useThemeColor({},"headerBackground")
    const headerBottomBorderColor = useThemeColor({}, "listBorderTranslucent")
    const headerTextColor = useThemeColor({},"text")

    return (
        <Tabs screenOptions={({route}) => ({
            tabBarStyle: {
                display: "none",
            },
            headerStyle: {
                backgroundColor: headerBackgroundColor,
                borderBottomColor: headerBottomBorderColor,
                borderBottomWidth: 1
            },
            headerTitleStyle: {
                color: headerTextColor,
            },
        })}>
            <Tabs.Screen name="index" options={{headerShown: false, href: null}}/>
            <Tabs.Screen name="studentDocumentation" options={{title: "Student Documentation", href: null}}/>
            <Tabs.Screen name="studentRecords" options={{title: "Student Records", href: null}}/>
            <Tabs.Screen name="studentSchedule" options={{title: "Student Schedule", href: null}}/>
        </Tabs>
    )
}