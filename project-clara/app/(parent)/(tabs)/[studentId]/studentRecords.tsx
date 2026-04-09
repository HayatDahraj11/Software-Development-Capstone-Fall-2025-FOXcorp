import { useParentLoginContext } from "@/src/features/context/ParentLoginContext";
import { Href, useLocalSearchParams, useRouter } from "expo-router";
import { ScrollView, StyleSheet, View } from "react-native";

import { useThemeColor } from "@/src/features/app-themes/logic/use-theme-color";
import Card from "@/src/features/cards/ui/Card";

export default function StudentRecordsScreen() {
    const {
        userStudents,
    } = useParentLoginContext();

    const { studentId } = useLocalSearchParams();
    const student = userStudents.find(item => item.id === studentId);
    const router = useRouter();

    const bg = useThemeColor({}, "background");
    const tint = useThemeColor({}, "tint");

    return (
        <View style={[styles.container, {backgroundColor: bg}]}>
            <ScrollView contentContainerStyle={styles.listContainer}>
                <Card
                    header="Attendance"
                    preview="View daily attendance records"
                    onPress={() => router.push(`/(parent)/(tabs)/${studentId}/studentAttendance` as Href)}
                    theme="list"
                    pressable={true}
                    icon={{name: "calendar", size: 22, color: "#3b82f6", backgroundColor: "#3b82f620"}}
                />
                <Card
                    header="Medical"
                    preview="View allergies, medications, conditions"
                    onPress={() => router.push(`/(parent)/(tabs)/${studentId}/studentMedical` as Href)}
                    theme="list"
                    pressable={true}
                    icon={{name: "medkit", size: 22, color: "#dc2626", backgroundColor: "#ef444420"}}
                />
                <Card
                    header="Incidents"
                    preview="View behavioral reports"
                    onPress={() => router.push(`/(parent)/(tabs)/${studentId}/studentIncidents` as Href)}
                    theme="list"
                    pressable={true}
                    icon={{name: "alert-circle", size: 22, color: "#d97706", backgroundColor: "#f59e0b20"}}
                />
                <Card
                    header="Schedule"
                    preview="View class times and days"
                    onPress={() => router.push(`/(parent)/(tabs)/${studentId}/studentSchedule` as Href)}
                    theme="list"
                    pressable={true}
                    icon={{name: "calendar-outline", size: 22, color: "#0ea5e9", backgroundColor: "#0ea5e920"}}
                />
                <Card
                    header="Documentation"
                    preview={student ? `${student.firstName}'s full documentation` : "View documentation"}
                    onPress={() => router.push(`/(parent)/(tabs)/${studentId}/studentDocumentation` as Href)}
                    theme="list"
                    pressable={true}
                    icon={{name: "document-text", size: 22, color: "#8b5cf6", backgroundColor: "#8b5cf620"}}
                />
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    listContainer: {
        paddingHorizontal: 20,
        justifyContent: 'center',
        marginTop: 10,
        gap: 0,
    },
});
