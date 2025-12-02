import { useParentLoginContext } from "@/context/ParentLoginContext";
import { Redirect } from "expo-router";
import { getCurrentUser } from "aws-amplify/auth";

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
    
    const {isDebug, updateIsDebug} = useParentLoginContext();
    
    isSignedIn().then((isSigned) => {
        if(isSigned) {
            updateIsDebug(false);
        } else {
            updateIsDebug(true);
        };
    })
    

    return (
        <Redirect href="/(parent)/(tabs)/home"/>
    );
}

