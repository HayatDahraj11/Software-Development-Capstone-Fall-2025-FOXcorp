import { useEffect, useState } from "react";
import { CreateLocalStorageForUser, LocalSettings, QueryLocalStorageForUser, UserCredentials } from "../api/storage_handler";


interface UseStoredSettingsReturn {
    app_theme: string;
    isLoading: boolean;
}

// takes in the current user's id and returns all of their settings
// also handles if given id has no stored settings
export function useStoredSettings(credentials: UserCredentials): UseStoredSettingsReturn {
    const [data, setData] = useState<LocalSettings>();
    const [isLoading, setIsLoading] = useState<boolean>(false)

    useEffect(() => {
        setIsLoading(true)
        const fetchData = async () => {
            try {
                const foundData = await QueryLocalStorageForUser(credentials);
                if(!foundData.success) {
                    throw new Error("User settings not found.");
                }
                else if(foundData.user_settings) {
                    setData(foundData.user_settings);
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
                    } else {
                        throw new Error("How did we get here?")
                    }
                } catch(e2) {

                }
            }
        }
    }, [credentials])

    if(data) {
        return {app_theme: data.app_theme, isLoading: false}
    } else {
        return {app_theme: "light", isLoading: false}
    }
}