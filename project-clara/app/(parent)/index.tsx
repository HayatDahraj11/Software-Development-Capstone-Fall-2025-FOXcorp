import { useParentLoginContext } from "@/src/features/context/ParentLoginContext";
import { Progress } from "@/src/rnreusables/ui/progress";
import { Redirect } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { View } from "react-native";



export default function Index() {
    const [isAllDone, setIsAllDone] = useState<boolean>(false);
    const [isContextDone, setIsContextDone] = useState<boolean>(false);
    const [progress, setProgress] = useState<number>(0);

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
        setProgress(10)
        await onSignIn();   
        setProgress(50);

        setIsContextDone(true);
    }

    useEffect(() => {
        startup();
    }, [])

    const finalize = useCallback(async() => {
        console.log(isContextLoading,isContextDone)
        if(!isContextLoading && isContextDone) {
            setProgress(90);
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
        return (
            <View style={{justifyContent: "center", alignContent: "center", alignItems: "center", flex: 1}}>
                <Progress value={progress} className="w-3/4 md:w-[60%]" style={{marginHorizontal: 22}}/>
            </View>
        )
    }
    
    //console.log("index loading over")
    


    return (
        <Redirect href="/(parent)/(tabs)"/>
    );
}

