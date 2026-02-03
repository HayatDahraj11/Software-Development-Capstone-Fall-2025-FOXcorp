import { Stack } from "expo-router";
import { TeacherLoginProvider } from "context/TeacherLoginContext";

export default function TeacherLayout() {
    return (

        // login context for teacher views
        // see context/TeacherLoginContext.js
        <TeacherLoginProvider>
        <Stack screenOptions={{ headerShown: false, }}>

            <Stack.Screen name="modal" options={{
                presentation: "transparentModal",
                animation: "slide_from_bottom",
                headerShown: false,
                title: "Modal",
            }}/>

        </Stack>
        </TeacherLoginProvider>
    )
}