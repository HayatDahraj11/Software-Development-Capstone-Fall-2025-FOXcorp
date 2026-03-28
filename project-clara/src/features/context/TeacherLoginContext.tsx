import { getCurrentUser, signOut } from "aws-amplify/auth";
import { createContext, ReactNode, useCallback, useContext, useEffect, useState } from "react";
import { Teacher, Class } from "src/features/fetch-user-data/api/teacher_data_fetcher";
import { debug_classes, debug_teacher } from "../auth/logic/debug_teacher_data";
import { useTeacherUserData } from "../fetch-user-data/logic/useTeacherUserData";
import { unregisterPushTokens } from "../notifications/api/pushTokenRepo";

export interface TeacherContextType {
    isContextLoading: boolean;
    isDebug: boolean;
    userTeacher: Teacher;
    userClasses: Class[];
    onSignIn: () => Promise<void>;
    onSignOut: () => Promise<void>;
}

// teacher-wide login context
export const TeacherLoginContext = createContext<TeacherContextType | null>(null);
// provider for the context, made with help from gemini
export const TeacherLoginProvider = ({children}: {children: ReactNode}) => {
    const [isContextLoading, setIsContextLoading] = useState<boolean>(false);
    const [isReadyForStateWaiter, setIsReadyForStateWaiter] = useState<boolean>(false);
    const [isReadyForFinalize, setIsReadyForFinalize] = useState<boolean>(false);

    // grabbing interface from useTeacherUserData.ts
    const {
        isLoading,
        teacher,
        classes,
        handleTeacherAndClassData
    } = useTeacherUserData();

    const [isDebug, setIsDebug] = useState<boolean>(true);
    // these are assumed to use debug info, and overwritted with real info later
    const [userTeacher, setUserTeacher] = useState<Teacher>(debug_teacher);
    const [userClasses, setUserClasses] = useState<Class[]>(debug_classes);

    // function runs when the user first signs in
    // this does not handle sign in operations with aws,
    // this only grabs user data and stores it in context
    const onSignIn = async() => {
        setIsContextLoading(true);
        let debugtemp: boolean = false;
        
        // checking if we are on a debug account or an aws account
        try {
            const userDetails = await getCurrentUser(); // only called to see if there is an aws account in use
            console.log("TeacherLoginContext.tsx, onSignIn: We are using an AWS account, proceeding.");
            setIsDebug(false);
        } catch(error) {
            const err = error as {name?: string, message?: string};
            console.warn(`Accessed Teacher views while not logged in, assuming debug login.\nError: ${err.message}`);
            debugtemp = true; // isDebug is assumed true and states are too slow to use it mid function like this, so we're using a temp var
        }

        // grabbing the class and teacher data using api
        if(!debugtemp) {
            const result = await handleTeacherAndClassData();
            if(result) {
                console.log("waiting for state change here.")
                setIsDebug(false);
                setIsReadyForStateWaiter(true);
            } else {
                console.log("handleTeacherAndClassData failed")
            }
        }

        setIsReadyForStateWaiter(true);
    }

    // this holds the next part of the onSignIn() process, setting local teacher and student states to what was found via aws
    // this is a separate function that only fully runs once either "isDebug" has been updated to true,
    // or once "teacher" and "students" have been updated with defined values
    const theStateWaiter = useCallback(async() => {
        //console.log("in the state waiter")
        if(!isReadyForStateWaiter) { return;}
        // if we are debug (or aws auth failed for some reason), use the hardcoded values
        if(isDebug) {
            console.log("debug teachers and kids returning!")
            setUserTeacher(debug_teacher);
            setUserClasses(debug_classes);  
            setIsReadyForFinalize(true);
        } else if(teacher !== undefined && classes !== undefined) {
            console.log("found aws teacher and student info! returning")
            setUserTeacher(teacher);
            setUserClasses(classes);
            setIsReadyForFinalize(true);
        }
    }, [teacher, classes, isDebug, isReadyForStateWaiter])

    // this useeffect is here so we have to wait for each of the states in the function are updated
    // states are slow! we have to wait like this or data will be missed
    useEffect(() => {
        theStateWaiter()
    }, [theStateWaiter])

    // this function simply waits for all three of its dependencies to update
    // because state vars are slow, we will sit here until "userTeacher", "userStudents", and "isReadyForFinalize" are all updated
    const waitForFinalUpdates = useCallback(async() => {
        if(!isReadyForFinalize) { return; }
        setIsContextLoading(false);
    }, [userTeacher, userClasses, isReadyForFinalize])

    // same as theStateWaiter(), waiting for each of the states above to update to truly run this part of the function
    useEffect(() => {
        waitForFinalUpdates();
    }, [waitForFinalUpdates])

    const onSignOut = async() => {
        setIsContextLoading(true);

        // function for logging out via aws
        async function AWSSignOut() {
            try {
                await signOut();
                console.log("AWS Signout sent and received");
                return true
            } catch(error) {
                console.log("AWS Signout sent and failed: ",{error})
                return false
            }
        }

        // clear push tokens before signing out so we dont get ghost notifications
        if (userTeacher?.userId) {
            await unregisterPushTokens(userTeacher.userId).catch((err) =>
                console.warn("Failed to unregister push tokens on logout:", err)
            );
        }

        // attempting logout with aws
        console.log("AWS Logout","AWS Logout attempted, trying to log out.")
        await AWSSignOut().then((success) => {
            if(success) {
                console.log("AWS Logout","AWS Logout successful! Rerouting...")
            } else {
                console.log("AWS Signout failed. Sorry!")
            }
        })

        // cleaning up state vars to default
        setIsContextLoading(false)
        setIsReadyForFinalize(false);
        setIsReadyForStateWaiter(false);
        setIsDebug(true);
        setUserTeacher(debug_teacher);
        setUserClasses(debug_classes);

        setIsContextLoading(false);
    }


    const userData = {
        isContextLoading,
        isDebug,
        userTeacher,
        userClasses,
        onSignIn,
        onSignOut,
    }

    return (
        <TeacherLoginContext.Provider value={userData}>
            {children}
        </TeacherLoginContext.Provider>
    );
};

// function that allows editing of context values
export const useTeacherLoginContext = () => {
    const context = useContext(TeacherLoginContext);
    if(!context) {
        throw new Error(`useTeacherLoginContext must be used TeacherLoginContext`);
    } else if(context === null) {
        throw new Error("useTeacherLoginContext: Context is null! Context must be used within Provider");
    }
    return context;
}
    