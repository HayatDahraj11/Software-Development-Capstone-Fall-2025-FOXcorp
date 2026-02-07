import { useParentLoginContext } from "@/context/ParentLoginContext";
import { getCurrentUser } from "aws-amplify/auth";
import { Redirect } from "expo-router";
import { useState } from "react";
import { Text, View } from "react-native";

// function to see if user is actually logged in to an AWS account or not
// if not, we will assume its a debug account and use local hard-coded information

async function isSignedIn() {
    try {
        const userDetails = await getCurrentUser();
        console.log("Logged in to Parent AWS account successfully! Continuing.");
        return true;
    } catch(error) {
        console.log(`Accessed Parent views while not logged in, assuming debug login.\nError: ${error}`);
        return false;
    };
}; 



export default function Index() {
    const [isAllDone, setIsAllDone] = useState<boolean>(false);
    
    const {isDebug, updateIsDebug} = useParentLoginContext();
    const [isLoading, setIsLoading] = useState<boolean>(true)

    isSignedIn().then((isSigned) => {
        setIsLoading(true)
        if(isSigned) {
            updateIsDebug(false);
        } else {
            updateIsDebug(true);
        };
        setIsLoading(false)
        setIsAllDone(true)
    })

    if(!isAllDone) {
        return <Text style={{color:"white"}}>Hello! I am a placeholder! Ignore me...</Text>
    }
    
    console.log("index loading over")
    


    return (
        <Redirect href="/(parent)/(tabs)"/>
    );
}

