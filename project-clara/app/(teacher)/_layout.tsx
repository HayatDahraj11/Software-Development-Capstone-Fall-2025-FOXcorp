import { Stack } from "expo-router";

export default function TeacherLayout() {
    return (
        <Stack screenOptions={{ headerShown: false, }}>

            <Stack.Screen name="modal" options={{
                presentation: "transparentModal",
                animation: "slide_from_bottom",
                headerShown: false,
                title: "Modal",
            }}/>

        </Stack>
    )
}