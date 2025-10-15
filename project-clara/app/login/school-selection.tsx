import { loginApi, type LoginResponse } from "../api/login";
import { useState } from "react";
import {
    StyleSheet,
    TextInput,
    View,
    Pressable,
    Text,
    ActivityIndicator,
    TouchableOpacity,
    KeyboardAvoidingView,
    Platform
} from "react-native";
import { Feather } from '@expo/vector-icons';
import { Href, useRouter } from "expo-router";
import { Colors } from "@/constants/theme";
import SchoolPicker from "@/components/SchoolPicker";





export default function SchoolSelection() {
    const router = useRouter();

    /*
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState<{ email?: string; password?: string; form?: string }>({});
    */

    const [school, setSchool] = useState<string | undefined>(undefined); // chosen school's name string
    const [isModalVisible, setIsModalVisible] = useState<boolean>(false); // if the school list popup modal is visible or not
    const [isSchoolSelected, setIsSchoolSelected] = useState<boolean>(false); 

    const onTapSelectSchool = () => {
        setIsModalVisible(true);
    };
    const onModalClose = () => {
        setIsModalVisible(false);
    };
    const onSchoolSelected = (school: string) => { // when user selectes a school in teh SchoolPicker modal, setSchool to it
        setSchool(school);
        setIsSchoolSelected(true);
    };

    /*
    const validate = () => {
        const newErrors: { email?: string; password?: string } = {};
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!email.trim()) {
            newErrors.email = "Email address is required.";
        } else if (!emailRegex.test(email)) {
            newErrors.email = "Please enter a valid email address.";
        }

        if (!password.trim()) {
            newErrors.password = "Password is required.";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };
    
    const handleLogin = () => {
        if (!validate()) return;

        setIsLoading(true);
        setErrors({});

        loginApi({ email, password }).then((response: LoginResponse) => {
    if (response.success) {
        router.replace('/(parent)/(tabs)');
    } else {
        setErrors({ form: response.message });
    }
    setIsLoading(false);
    });
    };
    */

    const sendToLogin = () => {
        router.push(("/login") as Href)
    }


    return (
        <KeyboardAvoidingView 
            behavior={Platform.OS === "ios" ? "padding" : "height"} 
            style={styles.container}
        >
            <View style={styles.headerContainer}>
                <View style={styles.logoContainer}>
                    <Feather name="book-open" size={40} color={Colors.light.tint} />
                </View>
                <Text style={styles.title}>Please select your school</Text>
                {/* if school has been selected, display it in the subtitle */}
                { isSchoolSelected ? ( 
                    <Text style={styles.subtitle}>Selected: {school}</Text>
                ) : ( <></> ) }
            </View>
            
            <View style={styles.formContainer}>
                {/* 
                <View style={styles.inputContainer}>
                    <Feather name="mail" size={20} color="#888" style={styles.icon} />
                    <TextInput
                        style={styles.input}
                        value={email}
                        onChangeText={setEmail}
                        placeholder="Enter Email Address..."
                        keyboardType="email-address"
                        autoCapitalize="none"
                        spellCheck={false}
                        onBlur={validate}
                    />
                </View>
                {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}

                <View style={styles.inputContainer}>
                    <Feather name="lock" size={20} color="#888" style={styles.icon} />
                    <TextInput
                        style={styles.input}
                        value={password}
                        onChangeText={setPassword}
                        placeholder="Enter Password..."
                        secureTextEntry={!isPasswordVisible}
                        autoCapitalize="none"
                        spellCheck={false}
                        onBlur={validate}
                    />
                    <TouchableOpacity onPress={() => setIsPasswordVisible(!isPasswordVisible)} style={styles.eyeIcon}>
                        <Feather name={isPasswordVisible ? "eye-off" : "eye"} size={20} color="#888" />
                    </TouchableOpacity>
                </View>
                {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
                
                {errors.form && <Text style={styles.formErrorText}>{errors.form}</Text>}
                */}
                

                <Pressable
                    style={({ pressed }) => [
                        styles.pressable,
                        {/*isLoading && styles.pressableDisabled,*/},
                        pressed && { opacity: 0.8 }
                    ]}
                    onPress={onTapSelectSchool}
                    //disabled={isLoading}
                >
                    {/* 
                    {isLoading ? (
                        <ActivityIndicator color="#FFFFFF" />
                    ) : (*/}
                        <Text style={styles.pressableLabel}>Find Your School</Text>
                    {/*)}*/}
                </Pressable>

                {/* if a school hasn't been selected, don't display 'Continue to Login' button */}
                { isSchoolSelected ? (
                    <Pressable
                        style={({ pressed }) => [
                            styles.pressable,
                            {/*isLoading && styles.pressableDisabled,*/},
                            pressed && { opacity: 0.8 }
                        ]}
                        onPress={sendToLogin}
                        //disabled={isLoading}
                    >
                        {/* 
                        {isLoading ? (
                            <ActivityIndicator color="#FFFFFF" />
                        ) : (*/}
                            <Text style={styles.pressableLabel}>Continue to Login</Text>
                        {/*)}*/}
                    </Pressable>
                ) : (
                    <></>
                )}
                
                <SchoolPicker isVisible={isModalVisible} onCloseModal={onModalClose} onSelect={onSchoolSelected}/>
            </View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 24,
        backgroundColor: '#F7F8FA',
    },
    headerContainer: {
        alignItems: 'center',
        marginBottom: 40,
    },
    logoContainer: {
        width: 80,
        height: 80,
        backgroundColor: '#FFFFFF',
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
        color: '#1D2939',
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 20,
        color: '#1D2939',
        marginTop: 8,
        textAlign: 'center',
    },
    formContainer: {
        width: '100%',
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
    icon: {
        marginRight: 12,
    },
    input: {
        flex: 1,
        height: '100%',
        fontSize: 16,
        color: '#1D2939',
    },
    eyeIcon: {
        padding: 5,
    },
    errorText: {
        alignSelf: 'flex-start',
        color: '#D92D20',
        marginTop: 6,
        marginLeft: 4,
    },
    formErrorText: {
        color: '#D92D20',
        textAlign: 'center',
        marginTop: 16,
    },
    pressable: {
        width: '100%',
        height: 56,
        marginTop: 24,
        backgroundColor: Colors.light.tint,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 12,
        shadowColor: Colors.light.tint,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
    },
    pressableDisabled: {
        backgroundColor: '#A9A9A9',
        shadowOpacity: 0,
    },
    pressableLabel: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: '600',
    },
});