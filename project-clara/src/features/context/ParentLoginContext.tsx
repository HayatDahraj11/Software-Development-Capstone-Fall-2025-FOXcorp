import { getCurrentUser } from "aws-amplify/auth";
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
            const userDetails = await getCurrentUser();
            console.log("ParentLoginContext.tsx, onSignIn: We are using an AWS account, proceeding.");
            setIsDebug(false);
        } catch(error) {
            const err = error as {name?: string, message?: string};
            console.warn(`Accessed Parent views while not logged in, assuming debug login.\nError: ${err.message}`);
            debugtemp = true;
            //setIsDebug(true)
        }
        /*
        // if we are debug (or aws auth failed for some reason), use the hardcoded values
        if(isDebug) {
            console.log("debug parents and kids returning!")
            setUserParent(debug_parent);
            setUserStudents(debug_kids);  
            setIsContextLoading(false);
            return;
        }*/

        // grabbing the student and parent data using api
        if(!debugtemp) {
            const result = await handleParentAndStudentData();
            if(result) {
                /*
                if(parent !== undefined && students !== undefined) {
                    console.log("found not undefined")
                    setUserParent(parent);
                    setUserStudents(students);
                    //setIsContextLoading(false);
                    return;
                } else {
                    console.log("found undefined?")
                    isDebug = true;
                    setUserParent(debug_parent);
                    setUserStudents(debug_kids);  
                    setIsContextLoading(false);
                    return;
                }*/
                console.log("waiting for state change here.")
                setIsDebug(false);
                setIsReadyForStateWaiter(true);
            } else {
                console.log("handleParentAndStudentData failed")
                //isDebug = true;
                //setUserParent(debug_parent);
                //setUserStudents(debug_kids);  
                //setIsContextLoading(false);
                //return;
            }
        }

        setIsReadyForStateWaiter(true);
    }

    const theStateWaiter = useCallback(async() => {
        console.log("in the state waiter")
        if(!isReadyForStateWaiter) { console.log("notready"); return;}
        // if we are debug (or aws auth failed for some reason), use the hardcoded values
        if(isDebug) {
            console.log("debug parents and kids returning!")
            setUserParent(debug_parent);
            setUserStudents(debug_kids);  
            setIsReadyForFinalize(true);
            //setIsContextLoading(false);
        } else if(parent !== undefined && students !== undefined) {
            console.log("found not undefined, "+parent.firstName+" "+students[0].firstName)
            setUserParent(parent);
            setUserStudents(students);
            setIsReadyForFinalize(true);
            //setIsContextLoading(false);
        }
    }, [parent, students, isDebug, isReadyForStateWaiter])

    // this useeffect is here so we have to wait for each of the below states to update
    useEffect(() => {
        theStateWaiter()
    }, [theStateWaiter])

    const waitForFinalUpdates = useCallback(async() => {
        if(!isReadyForFinalize) {console.log("isnotreadyforfinalize"); return; }
        console.log("final updates complete!"+userParent.firstName+" "+userStudents[0].firstName);
        setIsContextLoading(false);
    }, [userParent, userStudents, isReadyForFinalize])

    useEffect(() => {
        waitForFinalUpdates();
    }, [waitForFinalUpdates])

    const onSignOut = async() => {
        console.log("how did you call this?");
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
    