import { useCallback, useEffect, useState } from "react";
import { CreateLocalStorageForUser, LocalSettings, QueryLocalStorageForUser, UserCredentials } from "../api/storage_handler";


interface UseStoredSettingsReturn {
    app_theme: string;
    isLoading: boolean;
    handleStoredSettings: () => Promise<void>;
}

// takes in the current user's id and returns all of their settings
// also handles if given id has no stored settings
export function useStoredSettings(userId: string): UseStoredSettingsReturn {
    const [data, setData] = useState<LocalSettings>();
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [app_theme, setApp_Theme] = useState<string>("light")

    const handleStoredSettings = useCallback(async () => {
        const credentials: UserCredentials = {id: userId}
        const updateDataStates = () => {
            if(data?.app_theme){
                setApp_Theme(data?.app_theme);
            } else {
                console.warn("No app_theme provided, setting to light.")
                setApp_Theme("light")
            }
        }

        setIsLoading(true)

        const fetchData = async () => {
            console.log("HERE")
            try {
                const foundData = await QueryLocalStorageForUser(credentials);
                if(!foundData.success) {
                    throw new Error("User settings not found.");
                }
                else if(foundData.user_settings) {
                    setData(foundData.user_settings);
                    updateDataStates();
                    setIsLoading(false)
                } else {
                    throw new Error("Somehow, User settings marked success without any data?")
                }
            }
            catch(e) {
                try {
                    const newData = await CreateLocalStorageForUser(credentials);
                    if(!newData.success) {
                        throw new Error("Failed to create new settings for user");
                    }

                    const newFoundData = await QueryLocalStorageForUser(credentials);
                    if(!newFoundData.success) {
                        throw new Error("User settings generated then not found. Major error in logic!");
                    } else if(newFoundData.user_settings) {
                        setData(newFoundData.user_settings);
                        updateDataStates();
                        setIsLoading(false)
                    } else {
                        throw new Error("How did we get here?")
                    }
                } catch(e2) {
                    console.warn("User settings now successfully loaded after creation of new settings. Loading failsafe info.")
                    updateDataStates();
                    setIsLoading(false)
                }
            }
        }
    }, [userId, data])

    return {
        app_theme,
        isLoading,
        handleStoredSettings
    }
}