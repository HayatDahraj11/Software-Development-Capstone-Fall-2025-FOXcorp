import { useCallback, useState } from "react";
import { useColorScheme } from "react-native";
import { createLocalStorageForUser, queryLocalStorageForUser, StorageQueryResult, UserCredentials } from "../api/storage_handler";


interface UseStoredSettingsReturn {
    app_theme: string;
    isLoading: boolean;
    handleStoredSettings: () => Promise<void>;
}

// takes in the current user's id and returns all of their settings
// also handles if given id has no stored settings
export function useStoredSettings(userId: string): UseStoredSettingsReturn {
    const [isLoading, setIsLoading] = useState<boolean>(false)

    const colorScheme = useColorScheme();
    const currentSystemTheme: string = colorScheme === "dark" ? "dark" : "light";

    const [app_theme, setApp_Theme] = useState<string>(currentSystemTheme)

    const handleStoredSettings = useCallback(async () => {
        setIsLoading(true)
        const credentials: UserCredentials = {id: userId}
        // helper function to update all setting states in data
        const updateDataStates = (data: StorageQueryResult) => {
            if(data.user_settings?.app_theme){
                console.log("app_theme found: ",data.user_settings.app_theme)
                setApp_Theme(data.user_settings.app_theme);
            } else {
                console.warn("No app_theme provided, setting to system default.")
                setApp_Theme(currentSystemTheme)
            }
        }

        try {
            const foundData = await queryLocalStorageForUser(credentials, currentSystemTheme);
            if(!foundData.success) {
                throw new Error("User settings not found.");
            }
            else if(foundData.user_settings) {
                //console.log(foundData.user_settings)
                updateDataStates(foundData);
            } else {
                throw new Error("Somehow, User settings marked success without any data?")
            }
        }
        catch(e: unknown) {
            const err = e as {name?: string, message?: string};
            console.log("useStoredSettings.ts, handledStoredSettings: ",err.message);
            try {
                const newData = await createLocalStorageForUser(credentials, currentSystemTheme);
                if(!newData.success) {
                    throw new Error("Failed to create new settings for user");
                }

                const newFoundData = await queryLocalStorageForUser(credentials, currentSystemTheme);
                if(!newFoundData.success) {
                    throw new Error("User settings generated then not found. Major error in logic!");
                } else if(newFoundData.user_settings) {
                    //console.log(newFoundData.user_settings)
                    updateDataStates(newFoundData);
                } else {
                    throw new Error("How did we get here?")
                }
            } catch(e2) {
                const err2 = e2 as {name?: string, message?: string};
                console.error("User settings not successfully loaded after creation of new settings. Loading failsafe info.");
                console.error("useStoredSettings.ts, handledStoredSettings: ",err2.message);
            }
        }
        finally {
            setIsLoading(false);
        }
    }, [userId, currentSystemTheme])

    return {
        app_theme,
        isLoading,
        handleStoredSettings
    }
}