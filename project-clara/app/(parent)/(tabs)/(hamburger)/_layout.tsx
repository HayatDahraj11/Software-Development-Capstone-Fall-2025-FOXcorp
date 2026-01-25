import { Tabs } from "expo-router";
import { useThemeColor } from "@/src/features/app-themes/logic/use-theme-color";

export default function HamburgerLayout() {
    const headerBackgroundColor = useThemeColor({},"headerBackground")
    const headerBottomBorderColor = useThemeColor({}, "listBorderTranslucent")
    const headerTextColor = useThemeColor({},"text")
    
    return (
        <Tabs 
            screenOptions={({route}) => ({
            tabBarStyle: {
                display: "none",
            },
            headerStyle: {
                backgroundColor: headerBackgroundColor,
                borderBottomColor: headerBottomBorderColor,
                borderBottomWidth: 1
            },
            headerTitleStyle: {
                color: headerTextColor,
            },
        })}>
            <Tabs.Screen name="index" options={{headerShown: false, href: null}}/>
            <Tabs.Screen name="account_settings" options={{title: "Account Settings"}}/>
            <Tabs.Screen name="notification_settings" options={{title: "Notification Settings"}}/>
            <Tabs.Screen name="settings" options={{title: "Settings"}}/>
        </Tabs>
        
    )
}