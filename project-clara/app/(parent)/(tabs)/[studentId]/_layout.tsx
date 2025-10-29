import { Tabs, useRouter } from "expo-router";

export default function ParentGenInfoStudentIDLayout() {

    return (
        <Tabs screenOptions={({route}) => ({
            tabBarStyle: {
                display: "none",
            }
        })}>
            <Tabs.Screen name="index" options={{headerShown: false, href: null}}/>
            <Tabs.Screen name="studentDocumentation" options={{title: "Student Documentation", href: null}}/>
            <Tabs.Screen name="studentRecords" options={{title: "Student Records", href: null}}/>
            <Tabs.Screen name="studentSchedule" options={{title: "Student Schedule", href: null}}/>
        </Tabs>
    )
}