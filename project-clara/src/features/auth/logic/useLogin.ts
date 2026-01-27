import { useState, useEffect, useCallback } from "react";
import { useRouter } from "expo-router";
import { generateClient } from "aws-amplify/api";
import { loginUser } from "../api/authRepo";
import { saveUsername, loadUsername, clearUsername } from "@/utils/storage";
import { parentsByCognitoUserId } from "@/src/graphql/queries";
import type { ParentsByCognitoUserIdQuery } from "@/src/API";

export type LoginErrors = {
    username?: string;
    password?: string;
    form?: string;
};

interface UseLoginReturn {
    username: string;
    setUsername: (value: string) => void;
    password: string;
    setPassword: (value: string) => void;
    rememberMe: boolean;
    setRememberMe: (value: boolean) => void;
    isLoading: boolean;
    errors: LoginErrors;
    isPasswordVisible: boolean;
    togglePasswordVisibility: () => void;
    validate: () => boolean;
    handleLogin: () => Promise<void>;
}

export function useLogin(): UseLoginReturn {
    const router = useRouter();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [rememberMe, setRememberMe] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState<LoginErrors>({});
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);

    useEffect(() => {
        const loadSavedUsername = async () => {
            const saved = await loadUsername();
            if (saved) {
                setUsername(saved);
                setRememberMe(true);
            }
        };
        loadSavedUsername();
    }, []);

    const togglePasswordVisibility = useCallback(() => {
        setIsPasswordVisible((prev) => !prev);
    }, []);

    const validate = useCallback((): boolean => {
        const newErrors: LoginErrors = {};

        if (!username.trim()) {
            newErrors.username = "Username is required.";
        }

        if (!password.trim()) {
            newErrors.password = "Password is required.";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }, [username, password]);

    const handleLogin = useCallback(async () => {
        if (!validate()) return;

        setIsLoading(true);
        setErrors({});

        try {
            const result = await loginUser({ username, password });
            console.log("DEBUG - Login result:", result.success, result.userId);

            if (result.success && result.userId) {
                if (rememberMe) {
                    await saveUsername(username);
                } else {
                    await clearUsername();
                }

                // Check if user is a parent by querying Parent table
                console.log("DEBUG - Querying parent with userId:", result.userId);
                const client = generateClient();
                const response = await client.graphql({
                    query: parentsByCognitoUserId,
                    variables: { cognitoUserId: result.userId },
                });
                console.log("DEBUG - GraphQL response:", JSON.stringify(response));
                const data = response.data as ParentsByCognitoUserIdQuery;
                const parents = data?.parentsByCognitoUserId?.items ?? [];
                console.log("DEBUG - Parents found:", parents.length);

                if (parents.length > 0) {
                    console.log("DEBUG - Routing to parent");
                    router.replace("/(parent)/(tabs)");
                } else {
                    console.log("DEBUG - Routing to teacher");
                    router.replace("/(teacher)");
                }
                return;
            }

            if (__DEV__) {
                if (username === "parent_debug" && password === "debug") {
                    router.replace("/(parent)/(tabs)");
                    return;
                } else if (username === "teacher_debug" && password === "debug") {
                    router.replace("/(teacher)");
                    return;
                }
            }

            setErrors({ form: result.message });
        } catch (err: unknown) {
            const error = err as { message?: string };
            console.error("Sign in error", error);
            const message = error?.message ?? "Login failed";
            setErrors({ form: message });
        } finally {
            setIsLoading(false);
        }
    }, [username, password, rememberMe, validate, router]);

    return {
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
    };
}
