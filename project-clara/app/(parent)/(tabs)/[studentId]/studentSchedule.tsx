import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState, useCallback } from "react";
import { FlatList, StyleSheet, View } from "react-native";

import Parent_ViewClassModal from "@/src/features/class-viewer/ui/Parent_ViewClassModal";
import { useParentLoginContext } from "@/src/features/context/ParentLoginContext";
import Card from "@/src/features/cards/ui/Card";
import { useThemeColor } from "@/src/features/app-themes/logic/use-theme-color";
import { createStudentClassListCard, DataCard } from "@/src/features/cards/logic/cardDataCreator";

export default function StudentDocumentationScreen() {
    // context given student data
    const {
        userStudents,
        userClasses,
        userEnrollments,
        userTeachers,
        getClassesMappedByStudent,
    } = useParentLoginContext();
    const { studentId } = useLocalSearchParams();

    const [screenCards, setScreenCards] = useState<DataCard[]>([]);

    const firstLoad = useCallback(async() => {
        let cardset: DataCard[] = []

        const student = userStudents.find(item => item.id === studentId); // grabbing the student we are passed in
        const classIdsofStudent = getClassesMappedByStudent((studentId as string)); // grabbing class ids student are enrolled in
        if(student) {
            for(const i of classIdsofStudent) {
                const tempcla = userClasses.find(cla => cla.id === i);
                if(tempcla) {
                    const tempteach = userTeachers.find(teach => teach.id === tempcla.teacherId) 
                    if(tempteach) {
                        const tempcard = createStudentClassListCard(tempcla, tempteach.name);
                        cardset.push(tempcard);
                    }
                }
            }
        }

        setScreenCards(cardset);
    }, [getClassesMappedByStudent, studentId, userClasses, userStudents, userTeachers])

    useEffect(() => {
        firstLoad();
    }, [firstLoad])



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
            data={screenCards}
            contentContainerStyle={styles.listContainer}
            renderItem={({item, index}) => (
            <Card 
                header={item.header}
                preview={item.preview}
                theme={item.theme}
                onPress={() => onClassClicked(item.itemId)}
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

