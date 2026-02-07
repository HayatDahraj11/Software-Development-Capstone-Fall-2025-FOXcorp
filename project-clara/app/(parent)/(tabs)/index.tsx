import { debug_parent } from "@/src/features/auth/logic/debug_parent_data";
import { useStoredSettings } from "@/src/features/in-app-settings/logic/useStoredSettings";
import { Redirect } from "expo-router";
import { useEffect } from "react";
import { Text, View } from "react-native";



export default function Index() {

    // grabbing user settings from storage
    const {
        app_theme,
        isLoading,
        handleStoredSettings,
        matchAppToStoredSettings
    } = useStoredSettings(debug_parent.guardianUser.userId) // for now, hardwired to use debug parent. will change later

    useEffect(() => {
        const initSettings = async () => {
            await handleStoredSettings();
            await matchAppToStoredSettings();
        };
        initSettings();
    }, [])




    return (
        <View>
            {isLoading ? (
                <Text style={{color:"white"}}>Hello! I am a placeholder! Ignore me...</Text>
            ) : (
                <Redirect href="/(parent)/(tabs)/home"/>
            )}
        </View>
    );
}

