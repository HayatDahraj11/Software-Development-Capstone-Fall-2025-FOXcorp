import { Href, useRouter } from "expo-router";
import { FlatList, StyleSheet, View } from "react-native";

import { useThemeColor } from "@/src/features/app-themes/logic/use-theme-color";
import Card from "@/src/features/cards/ui/Card";
import { useLocalSearchParams } from "expo-router";
import { useTeacherLoginContext } from "@/src/features/context/TeacherLoginContext";

export default function attendanceList() {
const router = useRouter();
const { classId } = useLocalSearchParams();
const { userClasses } = useTeacherLoginContext();

console.log("userClasses raw:", JSON.stringify(userClasses, null, 2));
console.log("classId from router:", classId);

const classIdString = Array.isArray(classId) ? classId[0] : classId;

const selectedClass = userClasses.find(
  (cls) => cls.id === classIdString
);

const enrollments = selectedClass?.enrollments ?? [];

const students = enrollments
    .map((enrollment) => enrollment?.student)
    .filter((s): s is NonNullable<typeof s> => Boolean(s));
  
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: useThemeColor({}, "background")
  },
});

console.log("userClasses:", userClasses);
console.log("selectedClass:", selectedClass);
console.log("enrollments:", enrollments);
console.log("students:", students);

const CardFlatListData = students.map((student) => ({
    id: student.id,
    header: `${student.firstName} ${student.lastName}`,
    preview: "Tap for details",
    route: `/(teacher)/(class)/modal?studentId=${student.id}`,

    
}));

    const RouteCard = (route: string): void => {
            // if card has a route, use it. if not, ignore it
            if(route !== " ") {
                router.push( (route) as Href );
            }
            else { }
        };

    return (
            <View style={styles.container}>
                <FlatList
                    data={CardFlatListData}
                    renderItem={({item, index}) => (
                        <Card
                            header={item.header}
                            preview={item.preview}
                            onPress={() => RouteCard(item.route)}
                        />
                    )}
                />
            </View>
        );
}


