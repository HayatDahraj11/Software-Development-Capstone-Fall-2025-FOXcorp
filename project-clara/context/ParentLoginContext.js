import { createContext, useState, useContext } from "react";


// parent-wide login context
export const ParentLoginContext = createContext();
// provider for the context, made with help from gemini
export const ParentLoginProvider = ({children}) => {
    // if user is undefined, assume it's a debug login
    const [isDebug, setIsDebug] = useState(false);

    const updateIsDebug = (newData) => {
        setIsDebug(newData)
    };

    // for now, the only data we pass is whether or not we are in debug login mode
    // can expand later
    const loginData = {
        isDebug,
        updateIsDebug,
    };

    return (
        <ParentLoginContext.Provider value={loginData}>
            {children}
        </ParentLoginContext.Provider>
    );
};

// function that allows editing of context values
export const useParentLoginContext = () => {
    const context = useContext(ParentLoginContext);
    if(!context) {
        throw new Error(`useParentLoginContext must be used ParentLoginContext`)
    };
    return context;
}
    