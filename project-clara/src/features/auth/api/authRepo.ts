import { signIn, signOut, getCurrentUser } from "aws-amplify/auth";

export type LoginCredentials = {
    username: string;
    password: string;
};

export type LoginResult = {
    success: boolean;
    message: string;
    username?: string;
    userId?: string;
    nextStep?: string;
};

export type SignOutResult = {
    success: boolean;
    message: string;
};

export async function loginUser(credentials: LoginCredentials): Promise<LoginResult> {
    try {
        const { isSignedIn, nextStep } = await signIn({
            username: credentials.username,
            password: credentials.password,
        });

        if (isSignedIn) {
            const user = await getCurrentUser();
            return {
                success: true,
                message: "Login successful",
                username: user.username,
                userId: user.userId,
            };
        }

        return {
            success: false,
            message: `Further steps required: ${nextStep.signInStep}`,
            nextStep: nextStep.signInStep,
        };
    } catch (error: unknown) {
        const err = error as { name?: string; message?: string };
        console.log("DEBUG - Error name:", err.name);
        console.log("DEBUG - Error message:", err.message);
        console.log("DEBUG - Full error:", JSON.stringify(error, Object.getOwnPropertyNames(error)));

        let errorMessage = "Login failed. Please check your credentials.";

        if (err.name === "UserNotFoundException") {
            errorMessage = "User does not exist.";
        } else if (err.name === "NotAuthorizedException") {
            errorMessage = "Incorrect username or password.";
        } else if (err.name === "UserNotConfirmedException") {
            errorMessage = "Account not confirmed. Please check your email.";
        } else if (err.name === "UserAlreadyAuthenticatedException") {
            console.log("DEBUG - Handling UserAlreadyAuthenticatedException");
            const user = await getCurrentUser();
            console.log("DEBUG - Got user:", user.userId);
            return {
                success: true,
                message: "Already signed in",
                username: user.username,
                userId: user.userId,
            };
        } else if (err.message) {
            errorMessage = err.message;
        }

        return { success: false, message: errorMessage };
    }
}

export async function logoutUser(): Promise<SignOutResult> {
    try {
        await signOut();
        return { success: true, message: "Sign out successful" };
    } catch (error: unknown) {
        const err = error as { message?: string };
        console.error("Error signing out:", err);
        return { success: false, message: err.message || "Sign out failed" };
    }
}
