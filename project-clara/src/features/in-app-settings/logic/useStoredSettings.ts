import { useCallback, useState } from "react";
import { Appearance, useColorScheme } from "react-native";
import { createLocalStorageForUser, LocalSettings, queryLocalStorageForUser, StorageQueryResult, updateLocalStorageForUser, UserCredentials } from "../api/storage_handler";


interface UseStoredSettingsReturn {
    app_theme: string;
    isLoading: boolean;
    handleStoredSettings: () => Promise<void>;
    updateStoredSettings: (newSettings: LocalSettings) => Promise<void>;
    matchAppToStoredSettings: () => Promise<void>;
}

// takes in the current user's id and returns all of their settings
// also handles if given id has no stored settings
export function useStoredSettings(userId: string): UseStoredSettingsReturn {
    const [isLoading, setIsLoading] = useState<boolean>(false)

    const colorScheme = useColorScheme();
    const currentSystemTheme: string = colorScheme === "dark" ? "dark" : "light";

    const [app_theme, setApp_Theme] = useState<string>(currentSystemTheme)

    // helper function to update all setting states in data
    const updateDataStates = useCallback(async (data: StorageQueryResult) => {
        if(data.user_settings?.app_theme){
            console.log("app_theme found: ",data.user_settings.app_theme)
            setApp_Theme(data.user_settings.app_theme);
        } else {
            console.warn("No app_theme provided, setting to system default.")
            setApp_Theme(currentSystemTheme)
        }
    }, [currentSystemTheme])

    const handleStoredSettings = useCallback(async () => {
        setIsLoading(true)
        const credentials: UserCredentials = {id: userId}

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
    }, [userId, currentSystemTheme, updateDataStates])

    // takes in a new set of localsettings and updates the storage to match them
    const updateStoredSettings = useCallback(async (newSettings: LocalSettings) => {
        setIsLoading(true)
        const credentials: UserCredentials = {id: userId};

        try {
            const updateTry = await updateLocalStorageForUser(credentials, newSettings);
            if(!updateTry.success) {
                throw new Error("User setting update unsuccessful.");
            }
            else {
                console.log("Updates settings saved successfully.");
            }
        } catch(e) {
            const err = e as {name?: string, message?: string};
            console.error("useStoredSettings.ts, updateStorageSetting: ",err.message);
        } finally {
            setIsLoading(false);
        }
    }, [userId])

    // updating app properties to match stored settings
    // e.x., updating app appearance to match new color theme
    const matchAppToStoredSettings = useCallback(async () => {
        setIsLoading(true);
        const credentials: UserCredentials = {id: userId};

        try {
            const settings = await queryLocalStorageForUser(credentials, currentSystemTheme);
            if(!settings.user_settings) {
                throw new Error("Somehow, we got here without user settings?")
            } else {
                // the stuff this function will do will grow as the settings screen grows

                // updating app appearance to match saved app_theme
                Appearance.setColorScheme(settings.user_settings.app_theme === "light" ? "light" : "dark")

                // TODO:
                // changeable font sizes
                // changeable button sizes
            }

        } catch(e) {
            const err = e as {name?: string, message?: string};
            console.error("useStoredSettings.ts, matchAppToStoredSettings: ",err.message);
        } finally {
            setIsLoading(false)
        }
    }, [userId, currentSystemTheme])

    return {
        app_theme,
        isLoading,
        handleStoredSettings,
        updateStoredSettings,
        matchAppToStoredSettings
    }
}