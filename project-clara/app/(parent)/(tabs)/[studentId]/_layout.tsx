import { Stack } from "expo-router";

export default function ParentLayout() {
    return (
        <Stack>
            <Stack.Screen name="studentDocumentation" options={{title: "Student Documentation"}}/>
            <Stack.Screen name="studentRecords" options={{title: "Student Records"}}/>
            <Stack.Screen name="studentSchedule" options={{title: "Student Schedule"}}/>
        </Stack>
    )
}