import { useParentLoginContext } from "@/src/features/context/ParentLoginContext";
import { useStoredSettings } from "@/src/features/in-app-settings/logic/useStoredSettings";
import { Redirect } from "expo-router";
import { useEffect, useState } from "react";
import { Text } from "react-native";



export default function Index() {
    const [isAllDone, setIsAllDone] = useState<boolean>(false);
    const {
        userParent,
    } = useParentLoginContext();

    // grabbing user settings from storage
    const {
        isLoading,
        handleStoredSettings,
        matchAppToStoredSettings
    } = useStoredSettings(userParent.userId) // for now, hardwired to use debug parent. will change later

    const startup = async() => {
        await handleStoredSettings();
        //console.log("handlestored done");
        await matchAppToStoredSettings();
        //console.log("matchapp done");
        if(!isLoading) { setIsAllDone(true); }
    }

    useEffect(() => {
        startup();
    }, [])

    if(!isAllDone) {
        return ( <Text style={{color:"white"}}>Hello! I am a placeholder! Ignore me...</Text> )
    }

    //console.log("tabs/index loading over");

    return (
        <Redirect href="/(parent)/(tabs)/home"/>
    );
}

