import { useThemeColor } from "@/app-example/hooks/use-theme-color";
import SchoolPicker from "@/src/features/school-selection/ui/SchoolPicker";
import SchoolPickerComponent from "@/src/features/school-selection/ui/SchoolPickerComponent";
import { Button } from "@/src/rnreusables/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from '@/src/rnreusables/ui/dialog';
import { Feather } from '@expo/vector-icons';
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

export default function SchoolSelection() {
    // colors
    const modalbgcolor = useThemeColor({}, "modalBackground");
    const textcolor = useThemeColor({}, "text");
    const bgcolor = useThemeColor({}, "background");
    const fullbrightcolor = useThemeColor({}, "fullBright");
    const buttonbordercolor = useThemeColor({}, "buttonBorder");
    const listtextcolor = useThemeColor({}, "listText")
    const tintcolor = useThemeColor({}, 'tint');
    const placeholdertextcolor = useThemeColor({}, "placeholderText");


    const router = useRouter();
    const [school, setSchool] = useState<string | undefined>(undefined);
    const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
    const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

    // Animation value for the continue button
    const continueButtonOpacity = useSharedValue(0);

    const onSchoolSelected = (selectedSchool: string) => {
        setSchool(selectedSchool);
        setIsDialogOpen(false);
    };

    const sendToLogin = () => {
        if (!school) return;
        router.push({
            pathname: "/login",
            params: { schoolName: school }
        });
    }

    // Effect to animate the button when a school is selected
    useEffect(() => {
        continueButtonOpacity.value = withTiming(school ? 1 : 0, { duration: 300 });
    }, [school]);

    const animatedContinueButtonStyle = useAnimatedStyle(() => {
        return {
            opacity: continueButtonOpacity.value,
            transform: [{ translateY: continueButtonOpacity.value * 0 + (1 - continueButtonOpacity.value) * 20 }], // Slide up effect
        };
    });

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={[styles.container, {backgroundColor: bgcolor}]}
        >
            <View style={styles.headerContainer}>
                <View style={[styles.logoContainer, {backgroundColor: fullbrightcolor}]}>
                    <Feather name="book-open" size={40} color={tintcolor} />
                </View>
                <Text style={[styles.title, {color: textcolor}]}>Please select your school</Text>
            </View>

            <View style={styles.formContainer}>
                <Dialog 
                    open={isDialogOpen}
                    onOpenChange={() => {
                        if(isDialogOpen) {
                            setIsDialogOpen(false);
                        } else {setIsDialogOpen(true)}
                    }}
                >
                    <DialogTrigger asChild>
                        <Button variant="outline" style={[styles.selectionInput, {backgroundColor: fullbrightcolor}, {borderColor: buttonbordercolor}]} onPress={() => setIsDialogOpen(true)}>
                            {school ? (
                                <Text style={[styles.selectionInputText, {color: listtextcolor}]}>{school}</Text>
                            ) : (
                                <Text style={[styles.placeholderText, {color: placeholdertextcolor}]}>Select your school...</Text>
                            )}
                            <Feather name="chevron-down" size={20} color={placeholdertextcolor} />
                        </Button>
                    </DialogTrigger>
                    <DialogContent 
                        style={[styles.dialogueContainer, {backgroundColor: modalbgcolor}]}
                    >
                        <DialogHeader>
                            <DialogTitle style={{color: textcolor}}>Select a School</DialogTitle>
                        </DialogHeader>
                        <SchoolPickerComponent 
                            onSelect={(school)=>{
                                onSchoolSelected(school);
                            }}
                        />
                    </DialogContent>
                </Dialog>

                {school && (
                    <TouchableOpacity onPress={() => setIsModalVisible(true)}>
                        <Text style={[styles.changeSchoolText, {color: tintcolor}]}>Change School</Text>
                    </TouchableOpacity>
                )}

                <Animated.View style={[styles.continueButtonContainer, animatedContinueButtonStyle]}>
                    <Button variant={"default"} style={[styles.pressable, {backgroundColor: tintcolor}, {shadowColor: tintcolor}]} onPress={sendToLogin}>
                        <Text style={[styles.pressableLabel, {color: fullbrightcolor}]}>Continue to Login</Text>
                        <Feather name="arrow-right" size={20} color={fullbrightcolor} style={{ marginLeft: 8 }} />
                    </Button>
                </Animated.View>

                <SchoolPicker
                    isVisible={isModalVisible}
                    onCloseModal={() => setIsModalVisible(false)}
                    onSelect={onSchoolSelected}
                />
            </View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 24,
    },
    headerContainer: {
        alignItems: 'center',
        marginBottom: 40,
    },
    logoContainer: {
        width: 80,
        height: 80,
        borderRadius: 40,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 5,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    formContainer: {
        width: '100%',
    },
    selectionInput: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        height: 56,
        borderRadius: 12,
        paddingHorizontal: 16,
        borderWidth: 1,
    },
    selectionInputText: {
        fontSize: 16,
    },
    placeholderText: {
        fontSize: 16,
    },
    changeSchoolText: {
        textAlign: 'right',
        marginTop: 8,
        fontWeight: '500',
        textDecorationLine: 'underline',
    },
    continueButtonContainer: {
        width: '100%',
    },
    pressable: {
        flexDirection: 'row',
        width: '100%',
        height: 56,
        marginTop: 24,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 12,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
    },
    pressableLabel: {
        fontSize: 18,
        fontWeight: '600',
    },
    dialogueContainer: {
        minHeight: '30%',
        minWidth: '80%',
        width: '80%',
    },
});