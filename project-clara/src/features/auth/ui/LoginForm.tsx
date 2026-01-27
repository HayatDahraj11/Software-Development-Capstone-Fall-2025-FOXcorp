import { Feather } from "@expo/vector-icons";
import Checkbox from "expo-checkbox";
import {
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

import { useThemeColor } from "@/app-example/hooks/use-theme-color";
import { useLogin } from "../logic/useLogin";

type Props = {
    schoolName: string;
};

export default function LoginForm({ schoolName }: Props) {
    const {
        username,
        setUsername,
        password,
        setPassword,
        rememberMe,
        setRememberMe,
        isLoading,
        errors,
        isPasswordVisible,
        togglePasswordVisibility,
        validate,
        handleLogin,
    } = useLogin();


    const styles = StyleSheet.create({
        container: {
            flex: 1,
            justifyContent: "center",
            padding: 24,
            backgroundColor: useThemeColor({},"background"),
        },
        headerContainer: {
            alignItems: "center",
            marginBottom: 40,
        },
        logoContainer: {
            width: 80,
            height: 80,
            backgroundColor: useThemeColor({},"fullBright"),
            borderRadius: 40,
            justifyContent: "center",
            alignItems: "center",
            marginBottom: 20,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 3.84,
            elevation: 5,
        },
        title: {
            fontSize: 32,
            fontWeight: "bold",
            color: useThemeColor({},"text"),
            textAlign: "center",
        },
        subtitle: {
            fontSize: 16,
            color: useThemeColor({},"placeholderText"),
            marginTop: 8,
            textAlign: "center",
        },
        formContainer: {
            width: "100%",
        },
        inputContainer: {
            flexDirection: "row",
            alignItems: "center",
            width: "100%",
            height: 56,
            backgroundColor: useThemeColor({},"fullBright"),
            borderRadius: 12,
            paddingHorizontal: 16,
            marginTop: 16,
            borderWidth: 1,
            borderColor: useThemeColor({},"buttonBorder"),
        },
        icon: {
            marginRight: 12,
        },
        input: {
            flex: 1,
            height: "100%",
            fontSize: 16,
            color: useThemeColor({},"listText"),
        },
        eyeIcon: {
            padding: 5,
        },
        errorText: {
            alignSelf: "flex-start",
            color: useThemeColor({},"urgent"),
            marginTop: 6,
            marginLeft: 4,
        },
        formErrorText: {
            color: useThemeColor({},"urgent"),
            textAlign: "center",
            marginTop: 16,
        },
        rememberMeContainer: {
            flexDirection: "row",
            alignItems: "center",
            marginTop: 16,
        },
        rememberMeText: {
            marginLeft: 8,
            fontSize: 16,
            color: useThemeColor({},"text"),
        },
        pressable: {
            width: "100%",
            height: 56,
            marginTop: 24,
            backgroundColor: useThemeColor({},"tint"),
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 12,
            shadowColor: useThemeColor({},"tint"),
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 8,
            elevation: 5,
        },
        pressableDisabled: {
            backgroundColor: "#A9A9A9",
            shadowOpacity: 0,
        },
        pressableLabel: {
            color: useThemeColor({},"fullBright"),
            fontSize: 18,
            fontWeight: "600",
        },
    });
        const tintColor = useThemeColor({},"tint") // workaround for using useThemeColor in a conditional.

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.container}
        >
            <View style={styles.headerContainer}>
                <View style={styles.logoContainer}>
                    <Feather name="book-open" size={40} color={useThemeColor({},"tint")} />
                </View>
                <Text style={styles.title}>Welcome Back</Text>
                <Text style={styles.subtitle}>Logging in to: {schoolName}</Text>
            </View>

            <View style={styles.formContainer}>
                <View style={styles.inputContainer}>
                    <Feather name="user" size={20} color="#888" style={styles.icon} />
                    <TextInput
                        style={styles.input}
                        value={username}
                        onChangeText={setUsername}
                        placeholder="Enter Username..."
                        keyboardType="default"
                        autoCapitalize="none"
                        spellCheck={false}
                        onBlur={validate}
                    />
                </View>
                {errors.username && <Text style={styles.errorText}>{errors.username}</Text>}

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
                    <TouchableOpacity onPress={togglePasswordVisibility} style={styles.eyeIcon}>
                        <Feather
                            name={isPasswordVisible ? "eye-off" : "eye"}
                            size={20}
                            color="#888"
                        />
                    </TouchableOpacity>
                </View>
                {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}

                <View style={styles.rememberMeContainer}>
                    <Checkbox
                        value={rememberMe}
                        onValueChange={setRememberMe}
                        color={rememberMe ? tintColor : undefined}
                    />
                    <Text style={styles.rememberMeText}>Remember Me</Text>
                </View>

                {errors.form && <Text style={styles.formErrorText}>{errors.form}</Text>}

                <Pressable
                    style={({ pressed }) => [
                        styles.pressable,
                        isLoading && styles.pressableDisabled,
                        pressed && { opacity: 0.8 },
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