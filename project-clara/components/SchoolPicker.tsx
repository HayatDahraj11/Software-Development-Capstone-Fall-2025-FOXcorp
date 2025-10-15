import { Modal, View, Text, Pressable, StyleSheet, FlatList } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { Colors } from "@/constants/theme";

type Props = {
    isVisible: boolean;
    onCloseModal: () => void;
    onSelect: (school: string) => void;
};

export default function SchoolPicker({isVisible, onCloseModal, onSelect}: Props) {
    // below is a temporary predetermined data array for sample school choices
    const SchoolFlatListTempData = [
        { schoolName: "University of North Texas" },
        { schoolName: "Texas Woman's University" },
    ];


    return (
        <View>
            <Modal animationType="slide" transparent={true} visible={isVisible}>
                <View style={styles.overlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.titleContainer}>
                            <Text style={styles.titleText}>Select Your School</Text>
                            <Pressable onPress={onCloseModal}>
                                <Ionicons name={"close-circle-outline"} color={Colors.light.icon} size={22} />
                            </Pressable>
                        </View>
                        <View style={styles.listContainer}>
                            <FlatList
                                data={SchoolFlatListTempData}
                                renderItem={({item}) => (
                                    <Pressable
                                        style={styles.listItem}
                                        onPress={() => {
                                            onSelect(item.schoolName);
                                            onCloseModal();
                                    }}>
                                        <Text style={styles.listText}>{item.schoolName}</Text>    
                                    </Pressable>
                                )}
                            />
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create ({
    overlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalContent: {
        height: '90%',
        width: '100%',
        borderRadius: 30,
        position: 'absolute',
        bottom: 0, 
        backgroundColor: '#F7F8FA',
    },
    titleContainer: {
        height: '7%',
        backgroundColor: '#FFFFFF',
        paddingHorizontal: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    titleText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#1D2939',
        textAlign: 'center',
    },
    listContainer: {
        paddingHorizontal: 20,
        justifyContent: 'center',
        marginTop: 10,
    },
    listItem: {
        flex: 1/8,
        paddingBottom: 10,
    },
    listText: {
        fontSize: 16,
        padding: 4,
        borderWidth: 1,
        borderRadius: 3,
        borderLeftColor: 'rgba(0,0,0,0)',
        borderRightColor: 'rgba(0,0,0,0)',
        borderBottomColor: 'rgba(29, 41, 57, 0.25)',
        borderTopColor: 'rgba(29, 41, 57, 0.25)',
        color: '#1D2939',
        textAlign: 'left',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        height: 56,
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        paddingHorizontal: 16,
        marginTop: 16,
        borderWidth: 1,
        borderColor: '#E4E7EB',
    },
    input: {
        flex: 1,
        height: '100%',
        fontSize: 16,
        color: '#1D2939',
    },
})