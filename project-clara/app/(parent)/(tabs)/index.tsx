import { debug_parent } from "@/src/features/auth/logic/debug_parent_data";
import { useStoredSettings } from "@/src/features/in-app-settings/logic/useStoredSettings";
import { Redirect } from "expo-router";
import { useEffect } from "react";
import { Appearance, Text, View } from "react-native";



export default function Index() {
    
    // grabbing user settings from storage
    const {
        app_theme,
        isLoading,
        handleStoredSettings
    } = useStoredSettings(debug_parent.guardianUser.userId) // for now, hardwired to use debug parent. will change later

    useEffect(() => {
        handleStoredSettings();
    }, [])
    
    
    if(!isLoading) {
        if(app_theme === "light") {
            Appearance.setColorScheme("light")
        } else if(app_theme === "dark") {
            Appearance.setColorScheme("dark")
        } else {
            Appearance.setColorScheme("dark")
            console.warn("Settings did not have properly formatted color scheme. Setting to dark.")
        }
    }
    
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

