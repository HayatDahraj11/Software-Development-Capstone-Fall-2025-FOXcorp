import { useParentLoginContext } from "@/src/features/context/ParentLoginContext";
import { Redirect } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { Text } from "react-native";





export default function Index() {
    const [isAllDone, setIsAllDone] = useState<boolean>(false);
    const [isContextDone, setIsContextDone] = useState<boolean>(false);
    
    const {
        isContextLoading,
        isDebug,
        userParent,
        userStudents,
        userClasses,
        userEnrollments,
        onSignIn,
    } = useParentLoginContext();

    const startup = async() => {
        await onSignIn();   

        setIsContextDone(true);
    }

    useEffect(() => {
        startup();
    }, [])

    const finalize = useCallback(async() => {
        console.log(isContextLoading,isContextDone)
        if(!isContextLoading && isContextDone) {
            console.log(`onSignIn() done, info found: 
                are we debug?: ${isDebug}
                userParent id: ${userParent.userId}
                userParent name: ${userParent.firstName}
                number of students: ${userStudents.length}
                first class name: ${userClasses[0].name}
                number of classes: ${userClasses.length}
                number of enrollments: ${userEnrollments.length}`)
            setIsAllDone(true);
        }
    }, [isContextDone, isContextLoading])

    useEffect(()=> {
        finalize();
    }, [finalize])

    if(!isAllDone) {
        return <Text style={{color:"white"}}>Hello! I am a placeholder! Ignore me...</Text>
    }
    
    //console.log("index loading over")
    


    return (
        <Redirect href="/(parent)/(tabs)"/>
    );
}

