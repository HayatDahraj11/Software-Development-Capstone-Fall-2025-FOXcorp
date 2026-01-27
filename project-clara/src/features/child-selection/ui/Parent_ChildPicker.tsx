import { Ionicons } from "@expo/vector-icons";
import { FlatList, Modal, Pressable, StyleSheet, Text, View } from "react-native";

import { Colors } from "@/src/features/app-themes/constants/theme";
import { useThemeColor } from "../../app-themes/logic/use-theme-color";

type Props = {
    isVisible: boolean;
    onCloseModal: () => void;
    studentNames: string[];
    studentIds: string[];
    onSelect: (selection: string) => void;
    allowAll?: boolean // do we allow all children to be displayed at once?
};


export default function Parent_ChildPicker({isVisible, onCloseModal, studentNames, studentIds, onSelect, allowAll}: Props) {
    let children = [];
    for (let i = 0; i<studentNames.length; i++) {
      children.push({
        studentName: studentNames[i],
        studentId: studentIds[i],
      })
    }
    // Display All will, when selected, allow the displaying of all childrens' cards within whatever space is desired
    // It is optional, and the functionality after selected it will be handled by whoever calls it
    // Display All has a studentId of '0', which indicates a "Display All" selection
    if(allowAll) {
        children.reverse()
        children.push({
            studentName: 'Display All',
            studentId: '0'
        })
        children.reverse()
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
            position: 'absolute',
            bottom: 0, 
            backgroundColor: useThemeColor({},"modalBackground"),
        },
        titleContainer: {
            height: '7%',
            backgroundColor: useThemeColor({},"background"),
            paddingHorizontal: 20,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
        },
        titleText: {
            fontSize: 20,
            fontWeight: 'bold',
            color: useThemeColor({},"listText"),
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
            borderBottomColor: useThemeColor({},"listBorderTranslucent"),
            borderTopColor: useThemeColor({},'listBorderTranslucent'),
            color: useThemeColor({},"listText"),
            textAlign: 'left',
        },
    })

    return (
        <View>
            <Modal animationType="slide" transparent={true} visible={isVisible}>
                <View style={styles.overlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.titleContainer}>
                            <Text style={styles.titleText}>Filter by Child</Text>
                            <Pressable onPress={onCloseModal}>
                                <Ionicons name={"close-circle-outline"} color={Colors.light.icon} size={22} />
                            </Pressable>
                        </View>
                        <View style={styles.listContainer}>
                            <FlatList
                                data={children}
                                renderItem={({item}) => (
                                    <Pressable
                                        style={styles.listItem}
                                        onPress={() => {
                                            onSelect(item.studentId);
                                            onCloseModal();
                                    }}>
                                        <Text style={styles.listText}>{item.studentName}</Text>    
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