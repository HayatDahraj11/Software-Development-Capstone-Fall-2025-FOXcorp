import { Feather } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from "expo-router"; // <-- IMPORT ADDED
import { useState } from "react";
import {
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from "react-native";

import { Colors } from "@/constants/theme";

export default function Signup() {
    const router = useRouter();
    const params = useLocalSearchParams(); // <-- ADDED: Hook to get parameters
    const schoolName = params.schoolName as string; // <-- ADDED: Get the school name

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState<{ email?: string; password?: string; form?: string }>({});
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);

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
        if (password.trim() && (!confirmPassword.trim() || confirmPassword !== password)) {
            newErrors.password = "Passwords must be the same"
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleLogin = () => {
        if (!validate()) return;

        setIsLoading(true);
        setErrors({});

        setTimeout(() => {
            
            setErrors({ form: "Email/Password combo sent saved in 'email' and 'password' states." });
            console.log("email: ",email,"password: ",password)
            setIsLoading(false);
        }, 2000);
    };

    return (
        <KeyboardAvoidingView 
            behavior={Platform.OS === "ios" ? "padding" : "height"} 
            style={styles.container}
        >
            <View style={styles.headerContainer}>
                <View style={styles.logoContainer}>
                    <Feather name="book-open" size={40} color={Colors.light.tint} />
                </View>
                <Text style={styles.title}>Welcome Back</Text>
                {/* CHANGED: Display the school name passed from the previous screen */}
                <Text style={styles.subtitle}>Signing up to: {schoolName}</Text>
            </View>

            <View style={styles.formContainer}>
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
                <View style={styles.inputContainer}>
                    <Feather name="lock" size={20} color="#888" style={styles.icon} />
                    <TextInput
                        style={styles.input}
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                        placeholder="Re-enter Password..."
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

                <Pressable
                    style={({ pressed }) => [
                        styles.pressable,
                        isLoading && styles.pressableDisabled,
                        pressed && { opacity: 0.8 }
                    ]}
                    onPress={handleLogin}
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <ActivityIndicator color="#FFFFFF" />
                    ) : (
                        <Text style={styles.pressableLabel}>Login</Text>
                    )}
                </Pressable>
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
        fontSize: 16,
        color: '#667085',
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