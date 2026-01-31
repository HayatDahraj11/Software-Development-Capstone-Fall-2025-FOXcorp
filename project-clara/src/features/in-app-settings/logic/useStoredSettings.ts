import { useEffect, useState } from "react";
import { QueryLocalStorageForUser, CreateLocalStorageForUser, UserCredentials, StorageQueryResult } from "../api/storage_handler";


interface UseStoredSettingsReturn {
    app_theme: string;
}

// takes in the current user's id and returns all of their settings
// also handles if given id has no stored settings
export function useStoredSettings(credentials: UserCredentials): UseStoredSettingsReturn | undefined {
const [data, setData] = useState<UseStoredSettingsReturn | undefined>(undefined);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const foundData = await QueryLocalStorageForUser(credentials);
                if(!foundData.success) {
                    throw new Error("User settings not found.");
                }
                else if(foundData.user_settings) {
                    const conversion: UseStoredSettingsReturn = {
                        app_theme: foundData.user_settings?.app_theme
                    }
                    setData(conversion);
                } else {
                    throw new Error("Somehow, User settings marked success without any data?")
                }
            }
            catch(e) {
                try {
                    const newData = await CreateLocalStorageForUser(credentials);
                    const newFoundData = await QueryLocalStorageForUser(credentials);
                    if(!newFoundData.success) {
                        throw new Error("User settings generated then not found. Major error in logic!");
                    } else if(newFoundData.user_settings) {
                        const newConversion: UseStoredSettingsReturn = {
                            app_theme: newFoundData.user_settings.app_theme
                        };
                        setData(newConversion);
                    } else {
                        throw new Error("How did we get here?")
                    }
                } catch(e2) {

                }
            }
        }
    })

    return data
}