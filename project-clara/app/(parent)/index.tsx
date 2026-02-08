import { useParentLoginContext } from "@/src/features/context/ParentLoginContext";
import { Redirect } from "expo-router";
import { useEffect, useState } from "react";
import { Text } from "react-native";





export default function Index() {
    const [isAllDone, setIsAllDone] = useState<boolean>(false);
    
    const {
        isContextLoading,
        isDebug,
        userParent,
        userStudents,
        onSignIn,
    } = useParentLoginContext();

    const startup = async() => {
        await onSignIn();
        if(!isContextLoading) {
            console.log(`onSignIn() done, info found: 
                are we debug?: ${isDebug}
                userParent id: ${userParent.userId}
                userParent name: ${userParent.firstName}
                number of students: ${userStudents.length}`)
            setIsAllDone(true);
        }
    }

    useEffect(() => {
        startup();
    }, [])

    if(!isAllDone) {
        return <Text style={{color:"white"}}>Hello! I am a placeholder! Ignore me...</Text>
    }
    
    //console.log("index loading over")
    


    return (
        <Redirect href="/(parent)/(tabs)"/>
    );
}

