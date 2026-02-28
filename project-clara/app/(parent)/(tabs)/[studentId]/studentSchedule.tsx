import { useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { FlatList, StyleSheet, View } from "react-native";

import { useThemeColor } from "@/src/features/app-themes/logic/use-theme-color";
import { createStudentClassListCard, DataCard } from "@/src/features/cards/logic/cardDataCreator";
import Card from "@/src/features/cards/ui/Card";
import Parent_ViewClassModal from "@/src/features/class-viewer/ui/Parent_ViewClassModal";
import { useParentLoginContext } from "@/src/features/context/ParentLoginContext";
import { Class } from "@/src/features/fetch-user-data/api/parent_data_fetcher";

export default function StudentDocumentationScreen() {
    // context given student data
    const {
        userStudents,
        userClasses,
        userTeachers,
        getClassesMappedByStudent,
        getStudentGradeInClass,
        getTeacherNamebyId,
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
    const [selectedClass, setSelectedClass] = useState<Class>(userClasses[0]);

    const RouteCard = (route: string): void => {
        // as messaging has not been set up yet, just set to messages tab
        router.push("/(parent)/(tabs)/messaging")
    };

    const onTeacherClicked = () => {
        setIsModalVisible(false);
        RouteCard(selectedClass.teacherId);
    };

    const onClassClicked = (classId: string) => {
        setSelectedClass(userClasses.find(cla => cla.id === classId) ?? userClasses[0]) // if somehow userClasses.find comes back undefined, just use first class
        
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
            classId={selectedClass.id}
            className={selectedClass.name}
            teacherId={selectedClass.teacherId}
            teacherName={getTeacherNamebyId(selectedClass.teacherId)}
            studentGrade={getStudentGradeInClass((studentId as string), selectedClass.id)}
            onClickProfilePic={onTeacherClicked}
        />
    </View>
    );
}

