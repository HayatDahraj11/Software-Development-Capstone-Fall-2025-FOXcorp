import { useThemeColor } from "@/app-example/hooks/use-theme-color";
import SchoolPicker from "@/src/features/school-selection/ui/SchoolPicker";
import { Feather } from '@expo/vector-icons';
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
    KeyboardAvoidingView,
    Platform,
    Pressable,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

export default function SchoolSelection() {
    const router = useRouter();
    const [school, setSchool] = useState<string | undefined>(undefined);
    const [isModalVisible, setIsModalVisible] = useState<boolean>(false);

    // Animation value for the continue button
    const continueButtonOpacity = useSharedValue(0);

    const onSchoolSelected = (selectedSchool: string) => {
        setSchool(selectedSchool);
        setIsModalVisible(false);
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

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            justifyContent: 'center',
            padding: 24,
            backgroundColor: useThemeColor({},"background"),
        },
        headerContainer: {
            alignItems: 'center',
            marginBottom: 40,
        },
        logoContainer: {
            width: 80,
            height: 80,
            backgroundColor: useThemeColor({},"fullBright"),
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
            color: useThemeColor({},"text"),
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
            backgroundColor: useThemeColor({},"fullBright"),
            borderRadius: 12,
            paddingHorizontal: 16,
            borderWidth: 1,
            borderColor: useThemeColor({},"buttonBorder"),
        },
        selectionInputText: {
            fontSize: 16,
            color: useThemeColor({},"listText"),
        },
        placeholderText: {
            fontSize: 16,
            color: useThemeColor({},"placeholderText"),
        },
        changeSchoolText: {
            color: useThemeColor({},"tint"),
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
            backgroundColor: useThemeColor({},"tint"),
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 12,
            shadowColor: useThemeColor({},"tint"),
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 8,
            elevation: 5,
        },
        pressableLabel: {
            color: useThemeColor({},"fullBright"),
            fontSize: 18,
            fontWeight: '600',
        },
    });

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.container}
        >
            <View style={styles.headerContainer}>
                <View style={styles.logoContainer}>
                    <Feather name="book-open" size={40} color={useThemeColor({},"tint")} />
                </View>
                <Text style={styles.title}>Please select your school</Text>
            </View>

            <View style={styles.formContainer}>
                <Pressable style={styles.selectionInput} onPress={() => setIsModalVisible(true)}>
                    {school ? (
                        <Text style={styles.selectionInputText}>{school}</Text>
                    ) : (
                        <Text style={styles.placeholderText}>Select your school...</Text>
                    )}
                    <Feather name="chevron-down" size={20} color={useThemeColor({},"placeholderText")} />
                </Pressable>

                {school && (
                    <TouchableOpacity onPress={() => setIsModalVisible(true)}>
                        <Text style={styles.changeSchoolText}>Change School</Text>
                    </TouchableOpacity>
                )}

                <Animated.View style={[styles.continueButtonContainer, animatedContinueButtonStyle]}>
                    <Pressable
                        style={({ pressed }) => [styles.pressable, pressed && { opacity: 0.8 }]}
                        onPress={sendToLogin}
                    >
                        <Text style={styles.pressableLabel}>Continue to Login</Text>
                        <Feather name="arrow-right" size={20} color={useThemeColor({},"fullBright")} style={{ marginLeft: 8 }} />
                    </Pressable>
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