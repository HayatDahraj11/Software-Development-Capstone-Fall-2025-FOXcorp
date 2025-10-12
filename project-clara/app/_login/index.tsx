import { useState } from "react";
import {
    StyleSheet,
    TextInput,
    View,
    Pressable,
    Text,
    ActivityIndicator,
    TouchableOpacity
} from "react-native";
import { Feather } from '@expo/vector-icons';

import { Colors } from "@/constants/theme";

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
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

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleLogin = () => {
        if (!validate()) return;

        setIsLoading(true);
        setTimeout(() => {
            console.log('Login successful! Email:', email);
            setIsLoading(false);
        }, 2000);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Welcome Back</Text>

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

            <Pressable
                style={[styles.pressable, isLoading && styles.pressableDisabled]}
                onPress={handleLogin}
                disabled={isLoading}
            >
                {isLoading ? (
                    <ActivityIndicator color={Colors.light.background} />
                ) : (
                    <Text style={styles.pressableLabel}>Login</Text>
                )}
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: Colors.light.background,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: Colors.light.text,
        marginBottom: 30,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        height: 50,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        marginBottom: 5,
        paddingHorizontal: 10,
        backgroundColor: '#f9f9f9'
    },
    icon: {
        marginRight: 10,
    },
    input: {
        flex: 1,
        height: '100%',
        fontSize: 16,
    },
    eyeIcon: {
        padding: 5,
    },
    errorText: {
        alignSelf: 'flex-start',
        color: 'red',
        marginBottom: 10,
        marginLeft: 5,
    },
    pressable: {
        width: '100%',
        height: 50,
        marginTop: 15,
        backgroundColor: Colors.light.tint,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 8,
    },
    pressableDisabled: {
        backgroundColor: '#A9A9A9',
    },
    pressableLabel: {
        color: Colors.light.background,
        fontSize: 18,
        fontWeight: 'bold',
    },
});