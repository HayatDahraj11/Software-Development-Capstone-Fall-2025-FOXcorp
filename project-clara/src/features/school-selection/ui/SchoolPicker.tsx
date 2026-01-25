import { Ionicons } from "@expo/vector-icons";
import {
    ActivityIndicator,
    FlatList,
    Modal,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";

import { useThemeColor } from "../../app-themes/logic/use-theme-color";
import { SchoolItem, useSchoolSelection } from "../logic/useSchoolSelection";

type Props = {
    isVisible: boolean;
    onCloseModal: () => void;
    onSelect: (school: string) => void;
};

export default function SchoolPicker({ isVisible, onCloseModal, onSelect }: Props) {
    const { schools, loading, search, setSearch } = useSchoolSelection();

    const handleSelectSchool = (item: SchoolItem) => {
        onSelect(item.name);
        onCloseModal();
    };

    const renderItem = ({ item }: { item: SchoolItem }) => (
        <Pressable style={styles.listItem} onPress={() => handleSelectSchool(item)}>
            <Text style={styles.listText}>{item.name}</Text>
        </Pressable>
    );

    const styles = StyleSheet.create({
        overlay: {
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(0,0,0,0.5)",
        },
        modalContent: {
            height: "90%",
            width: "100%",
            position: "absolute",
            bottom: 0,
            backgroundColor: useThemeColor({},"modalBackground"),
        },
        titleContainer: {
            height: "7%",
            backgroundColor: useThemeColor({},"fullBright"),
            paddingHorizontal: 20,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
        },
        titleText: {
            fontSize: 20,
            fontWeight: "bold",
            color: useThemeColor({},"text"),
            textAlign: "center",
        },
        listContainer: {
            paddingHorizontal: 20,
            justifyContent: "center",
            marginTop: 10,
            flex: 1,
        },
        listItem: {
            flex: 1 / 8,
            paddingBottom: 10,
        },
        listText: {
            fontSize: 16,
            padding: 4,
            borderWidth: 1,
            borderRadius: 3,
            borderLeftColor: "rgba(0,0,0,0)",
            borderRightColor: "rgba(0,0,0,0)",
            borderBottomColor: useThemeColor({},"listBorderTranslucent"),
            borderTopColor: useThemeColor({},"listBorderTranslucent"),
            color: useThemeColor({},"listText"),
            textAlign: "left",
        },
        inputContainer: {
            flexDirection: "row",
            alignItems: "center",
            width: "100%",
            height: 56,
            backgroundColor: useThemeColor({},"fullBright"),
            borderBottomLeftRadius: 12,
            borderBottomRightRadius: 12,
            paddingHorizontal: 16,
            borderWidth: 1,
            borderColor: useThemeColor({},"buttonBorder"),
        },
        input: {
            flex: 1,
            height: "100%",
            fontSize: 16,
            color: useThemeColor({},"listText"),
        },
        loader: {
            marginTop: 40,
        },
    });
    const tintColor = useThemeColor({},"tint") // workaround for using useThemeColor in a conditional.


    return (
        <View>
            <Modal animationType="slide" transparent={true} visible={isVisible}>
                <View style={styles.overlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.titleContainer}>
                            <Text style={styles.titleText}>Select Your School</Text>
                            <Pressable onPress={onCloseModal}>
                                <Ionicons
                                    name="close-circle-outline"
                                    color={useThemeColor({},"icon")}
                                    size={22}
                                />
                            </Pressable>
                        </View>
                        <View style={styles.inputContainer}>
                            <TextInput
                                style={styles.input}
                                value={search}
                                onChangeText={setSearch}
                                placeholder="Enter School Name..."
                                autoCapitalize="none"
                                spellCheck={false}
                            />
                        </View>
                        <View style={styles.listContainer}>
                            {loading ? (
                                <ActivityIndicator
                                    size="large"
                                    color={tintColor}
                                    style={styles.loader}
                                />
                            ) : (
                                <FlatList
                                    data={schools}
                                    keyExtractor={(item) => item.id}
                                    renderItem={renderItem}
                                />
                            )}
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
}