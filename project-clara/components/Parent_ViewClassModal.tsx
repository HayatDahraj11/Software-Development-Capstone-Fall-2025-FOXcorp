// this is a popup modal which displays information about a given class
// given the classId and the studentId
// currently, this modal is designed before we have the backend role stuff set up
// when we have the backend ready, information about the class will be pulled based on class and student Id
// for now, this is static
import { Modal, View, Text, Pressable, StyleSheet, FlatList, TextInput } from "react-native";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";

import { Colors } from "@/constants/theme";
import { useEffect, useState } from "react";


type Props = {
    isVisible: boolean;
    onCloseModal: () => void;
    classId: string;
    studentId: string;
    onClickProfilePic: (teacherId: string) => void; // teacher's pfp is clickable, routes to messages for teacher
};

const PlaceholderImage = require('@/assets/images/icon.png')

export default function Parent_ViewClassModal({isVisible, onCloseModal, classId, studentId, onClickProfilePic}: Props) {
    

    return (
        <View>
            <Modal animationType="slide" transparent={true} visible={isVisible}>
                <View style={styles.overlay}>
                    <View style={styles.modalContainer}>
                        <View style={styles.modalContent}>
                            <View style={styles.titleContainer}>
                                <Pressable onPress={onCloseModal}>
                                    <Ionicons name={"close-circle-outline"} color={Colors.light.icon} size={22} />
                                </Pressable>
                            </View>
                            <View style={styles.classContainer}>
                                <Text style={styles.classText}>ClassName</Text>
                                <Text style={styles.classText}>Grade: StudentGrade</Text>
                            </View>
                            <View style={styles.teacherContainer}>
                                <View style={styles.teacherTextContainer}>
                                    <Text style={styles.teacherText}>Teacher:</Text>
                                </View>
                                <View style={styles.teacherTextContainer}>
                                    <View style={styles.teacherImageContainer}>
                                        <Image source={PlaceholderImage} style={styles.teacherImage}/>
                                    </View>
                                    <Text style={styles.teacherNameText}>TeacherName</Text>
                                </View>
                            </View>
                            <View style={styles.notesContainer}>
                                <Text style={styles.notesHeaderText}>Teacher Notes:</Text>
                                <Text style={styles.notesText}>This teacher has left no notes about your student!</Text>
                            </View>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    )
}

const styles = StyleSheet.create ({
    overlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalContainer: {
        width: '80%',
        height: '50%',
        borderRadius: 10,
        position: 'relative',
        backgroundColor: '#F7F8FA',
    },
    modalContent: {
        flex: 1,
        padding: 0,
        flexDirection: 'column',
        justifyContent: 'flex-start',
    },
    titleContainer: {
        padding: 10,
    },
    classContainer: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        flex: 1/7,
        flexDirection: 'row',
        alignItems: 'stretch',
        justifyContent: 'space-between',
    },
    classText: {
        fontSize: 16,
        fontWeight: 'normal',
        color: '#1D2939',
        textAlign: 'center',
    },
    teacherContainer: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        flex: 1/4,
        flexDirection: 'column',
    },
    teacherTextContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
    },
    teacherText: {
        fontSize: 16,
        fontWeight: 'normal',
        color: '#1D2939',
        textAlign: 'center',
        paddingHorizontal: 10,
        paddingVertical: 5,
    },
    teacherNameText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#1D2939',
        textAlign: 'center',
        paddingHorizontal: 10,
    },
    teacherImageContainer: {
        width: 50,
        height: 50,
        borderRadius: 50,
        alignContent: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.dark.background,
    },
    teacherImage: {
        width: '90%',
        height: '90%',
        borderRadius: 50,
        alignSelf: 'center',
    },
    notesContainer: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        flex: 1/4,
        flexDirection: 'column',
    },
    notesHeaderText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#1D2939',
        paddingHorizontal: 10,
    },
    notesText: {
        fontSize: 16,
        fontWeight: 'normal',
        color: '#1D2939',
    },
})