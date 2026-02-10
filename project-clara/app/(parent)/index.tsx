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
        onSignIn,
    } = useParentLoginContext();

    const startup = async() => {
        await onSignIn();
        /*
        if(!isContextLoading) {
            console.log(`onSignIn() done, info found: 
                are we debug?: ${isDebug}
                userParent id: ${userParent.userId}
                userParent name: ${userParent.firstName}
                number of students: ${userStudents.length}`)
            setIsAllDone(true);
        }*/
       //console.log("hi!")
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
                number of students: ${userStudents.length}`)
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

