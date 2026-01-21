import { useLocalSearchParams } from "expo-router";
import LoginForm from "@/src/features/auth/ui/LoginForm";

export default function Login() {
    const params = useLocalSearchParams();
    const schoolName = params.schoolName as string;

    return <LoginForm schoolName={schoolName} />;
}
