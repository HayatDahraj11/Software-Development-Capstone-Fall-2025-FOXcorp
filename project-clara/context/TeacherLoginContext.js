import { createContext, useState, useContext } from "react";


// teacher-wide login context
export const TeacherLoginContext = createContext();
// provider for the context, made with help from gemini
export const TeacherLoginProvider = ({children}) => {
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
        <TeacherLoginContext.Provider value={loginData}>
            {children}
        </TeacherLoginContext.Provider>
    );
};

// function that allows editing of context values
export const useTeacherLoginContext = () => {
    const context = useContext(TeacherLoginContext);
    if(!context) {
        throw new Error(`useTeacherLoginContext must be used TeacherLoginContext`)
    };
    return context;
}
    