import { getCurrentUser, signOut } from "aws-amplify/auth";
import { createContext, ReactNode, useCallback, useContext, useEffect, useState } from "react";
import { Parent, Student } from "src/features/fetch-user-data/api/parent_data_fetcher";
import { debug_kids, debug_parent } from "../auth/logic/debug_parent_data";
import { useUserData } from "../fetch-user-data/logic/useUserData";

export interface ParentContextType {
    isContextLoading: boolean;
    isDebug: boolean;
    userParent: Parent;
    userStudents: Student[];
    onSignIn: () => Promise<void>;
    onSignOut: () => Promise<void>;
}

// parent-wide login context
export const ParentLoginContext = createContext<ParentContextType | null>(null);
// provider for the context, made with help from gemini
export const ParentLoginProvider = ({children}: {children: ReactNode}) => {
    const [isContextLoading, setIsContextLoading] = useState<boolean>(false);
    const [isReadyForStateWaiter, setIsReadyForStateWaiter] = useState<boolean>(false);
    const [isReadyForFinalize, setIsReadyForFinalize] = useState<boolean>(false);

    // grabbing interface from useUserData.ts
    const {
        isLoading,
        parent,
        students,
        handleParentAndStudentData
    } = useUserData();

    const [isDebug, setIsDebug] = useState<boolean>(true);
    // these are assumed to use debug info, and overwritted with real info later
    const [userParent, setUserParent] = useState<Parent>(debug_parent);
    const [userStudents, setUserStudents] = useState<Student[]>(debug_kids);

    // function runs when the user first signs in
    // this does not handle sign in operations with aws,
    // this only grabs user data and stores it in context
    const onSignIn = async() => {
        setIsContextLoading(true);
        let debugtemp: boolean = false;
        
        // checking if we are on a debug account or an aws account
        try {
            const userDetails = await getCurrentUser(); // only called to see if there is an aws account in use
            console.log("ParentLoginContext.tsx, onSignIn: We are using an AWS account, proceeding.");
            setIsDebug(false);
        } catch(error) {
            const err = error as {name?: string, message?: string};
            console.warn(`Accessed Parent views while not logged in, assuming debug login.\nError: ${err.message}`);
            debugtemp = true; // isDebug is assumed true and states are too slow to use it mid function like this, so we're using a temp var
        }

        // grabbing the student and parent data using api
        if(!debugtemp) {
            const result = await handleParentAndStudentData();
            if(result) {
                console.log("waiting for state change here.")
                setIsDebug(false);
                setIsReadyForStateWaiter(true);
            } else {
                console.log("handleParentAndStudentData failed")
            }
        }

        setIsReadyForStateWaiter(true);
    }

    // this holds the next part of the onSignIn() process, setting local parent and student states to what was found via aws
    // this is a separate function that only fully runs once either "isDebug" has been updated to true,
    // or once "parent" and "students" have been updated with defined values
    const theStateWaiter = useCallback(async() => {
        //console.log("in the state waiter")
        if(!isReadyForStateWaiter) { return;}
        // if we are debug (or aws auth failed for some reason), use the hardcoded values
        if(isDebug) {
            console.log("debug parents and kids returning!")
            setUserParent(debug_parent);
            setUserStudents(debug_kids);  
            setIsReadyForFinalize(true);
        } else if(parent !== undefined && students !== undefined) {
            console.log("found aws parent and student info! returning")
            setUserParent(parent);
            setUserStudents(students);
            setIsReadyForFinalize(true);
        }
    }, [parent, students, isDebug, isReadyForStateWaiter])

    // this useeffect is here so we have to wait for each of the states in the function are updated
    // states are slow! we have to wait like this or data will be missed
    useEffect(() => {
        theStateWaiter()
    }, [theStateWaiter])

    // this function simply waits for all three of its dependencies to update
    // because state vars are slow, we will sit here until "userParent", "userStudents", and "isReadyForFinalize" are all updated
    const waitForFinalUpdates = useCallback(async() => {
        if(!isReadyForFinalize) { return; }
        setIsContextLoading(false);
    }, [userParent, userStudents, isReadyForFinalize])

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
        setUserParent(debug_parent);
        setUserStudents(debug_kids);

        setIsContextLoading(false);
    }


    const userData = {
        isContextLoading,
        isDebug,
        userParent,
        userStudents,
        onSignIn,
        onSignOut,
    }

    return (
        <ParentLoginContext.Provider value={userData}>
            {children}
        </ParentLoginContext.Provider>
    );
};

// function that allows editing of context values
export const useParentLoginContext = () => {
    const context = useContext(ParentLoginContext);
    if(!context) {
        throw new Error(`useParentLoginContext must be used ParentLoginContext`);
    } else if(context === null) {
        throw new Error("useParentLoginContext: Context is null! Context must be used within Provider");
    }
    return context;
}
    