import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { FlatList, StyleSheet, View } from "react-native";

import Parent_ViewClassModal from "@/src/features/class-viewer/ui/Parent_ViewClassModal";
import Card from "@/src/features/cards/ui/Card";
import { useThemeColor } from "@/src/features/app-themes/logic/use-theme-color";

// temp class list flatlist will use
const FlatListTempData = [
    {
        className: "English",
        teacherName: "Mrs. Dorthey",
        classId: "10"
    },
    {
        className: "Maths",
        teacherName: "Mrs. Knowles",
        classId: "11"
    },
    {
        className: "Science",
        teacherName: "Mr. Brock",
        classId: "12"
    },
]

export default function StudentDocumentationScreen() {
    const { studentId } = useLocalSearchParams();
    const router = useRouter();
    const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
    const [toTeacherId, setToTeacherId] = useState<string | undefined>(undefined);
    const [selectedClassId, setSelectedClassId] = useState<string>("");

    const RouteCard = (route: string): void => {
        // as messaging has not been set up yet, just set to messages tab
        router.push("/(parent)/(tabs)/messaging")
    };

    const onTeacherClicked = (teacherId: string) => {
        setToTeacherId(teacherId);
        RouteCard(teacherId);
        setIsModalVisible(false);
    };

    const onClassClicked = (classId: string) => {
        setIsModalVisible(true);
    };

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: useThemeColor({},"background")
        },
        listContainer: {
                paddingHorizontal: 20,
                justifyContent: 'center',
                marginTop: 10,
            },
    });

    return (
    <View style={styles.container}>
        <FlatList
            data={FlatListTempData}
            contentContainerStyle={styles.listContainer}
            renderItem={({item, index}) => (
            <Card 
                header={item.className}
                preview={item.teacherName}
                theme={"list"}
                onPress={() => onClassClicked(item.classId)}
            />
            )}
        />

        <Parent_ViewClassModal 
            isVisible={isModalVisible}
            onCloseModal={() => setIsModalVisible(false)}
            classId={selectedClassId}
            studentId={studentId.toString()}
            onClickProfilePic={onTeacherClicked}
        />
    </View>
    );
}

