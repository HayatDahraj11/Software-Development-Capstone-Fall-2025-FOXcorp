// holds functions for checking storage for current user
// and creating a new storage instance for a new user
// a user's settings are tied to their id string

import AsyncStorage from "@react-native-async-storage/async-storage";

export type UserCredentials = {
    id: string; // user's id
}

export type LocalSettings = {
    app_theme: string; // 'dark' or 'light'
}

export type StorageQueryResult = {
    success: boolean;
    message: string;
    user_settings?: LocalSettings // if success, this is passed. 
}

export type StorageCreationResult = {
    success: boolean;
    message: string;
}

// a default set of settings to replace any missing/incorrect values in stored settings
// or, useful for a "reset settings" option
function getDefaultSettings(systemTheme: string): LocalSettings {
    const defaults: LocalSettings = {
        app_theme: systemTheme
    }
    return defaults
}

// searches storage for settings matching user id in usercredentials
// returns settings on success, returns a failure message on fail
export async function queryLocalStorageForUser(credentials: UserCredentials, systemTheme: string): Promise<StorageQueryResult> {
    const defaultSettings: LocalSettings = getDefaultSettings(systemTheme)
    // grabbing stored data
    try{
        const userJson = await AsyncStorage.getItem(credentials.id); // will fail if no matching data of given user id
        if(userJson != null) {
            const userObject = JSON.parse(userJson)
            const userSettings: LocalSettings = {app_theme: userObject["app_theme"]}
            // if app theme is missing or stored incorrectly, correct it now! 
            if(userSettings.app_theme !== "light" && userSettings.app_theme !== "dark") {
                console.log("User theme missing, setting to default.")
                userSettings.app_theme = defaultSettings.app_theme;
            }

            console.log("Settings for for this user, returning them!");
            console.log("User settings: ",userSettings," Theme: ",userSettings.app_theme);
            return { success: true, message: "User settings found!", user_settings: userSettings };
        } 
        // if there is a matching id but no settings in it, throw an error
        else {
            throw new Error("user id found but settings are null.");
        }
    } catch(e) {
        const err = e as {name?: string, message?: string}
        console.warn("storage_handler.ts, QueryLocalStorageForUser: ",err.message)
        return { success: false, message: "See logs for error" }
    }
}

// creates a new dictionary of settings for a new user id
export async function createLocalStorageForUser(credentials: UserCredentials, systemTheme: string): Promise<StorageCreationResult> {
    const userDefaults:LocalSettings = getDefaultSettings(systemTheme); 
    const userDefaultsStringify = JSON.stringify(userDefaults); 
    try {
        await AsyncStorage.setItem(credentials.id, userDefaultsStringify)
        console.log("Default settings created for ths user, returning success!")
        return { success: true, message: "New settings created for user" }
    } catch(e) {
        const err = e as {name?: string, message?: string}
        console.error("storage_handler.ts, CreateLocalStorageForUser: ",err.message)
        return { success: false, message: "See logs for error" }
    }
}

// updates existing user settings
// returns whether it was a success or not
export async function updateLocalStorageForUser(credentials: UserCredentials, newSettings: LocalSettings): Promise<StorageCreationResult> {
    const newSettingsStringify = JSON.stringify(newSettings);
    try {
        await AsyncStorage.setItem(credentials.id, newSettingsStringify);
        console.log("Settings saved successfully.");
        return { success: true, message: "Settings saved successfully." };
    } catch(e) {
        const err = e as {name?: string, message?: string}
        console.error("storage_handler.ts, updateLocalStorageForUser: ",err.message)
        return { success: false, message: "See logs for error" }
    }
}