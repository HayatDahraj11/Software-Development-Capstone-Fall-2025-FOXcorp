// Import Amplify Auth functions (modern v6+ syntax)
import { signIn, getCurrentUser, signOut } from 'aws-amplify/auth';

// Type definition for the data the login screen sends
export type LoginRequest = {
  email: string;
  password: string;
  // we can Add schoolName here if our API needs it
  // schoolName?: string; 
};

// Type definition for the response the API sends back
export type LoginResponse = {
  success: boolean;
  message: string;
  username?: string; // Optional: Send back username on success
};

// Function to handle the login attempt using AWS Amplify Cognito
export async function loginApi({ email, password }: LoginRequest): Promise<LoginResponse> {
  try {
    // Attempt to sign in using email as the username
    const { isSignedIn, nextStep } = await signIn({
      username: email, 
      password,
    });

    // Check if sign-in was successful immediately
    if (isSignedIn) {
      // Optional: Fetch user details after successful sign-in
      const user = await getCurrentUser(); // Example: Get username
      return { 
          success: true, 
          message: "Login successful", 
          username: user.username // Send username back
      };
    } else {
      // here we can  Handle cases where sign-in isn't complete (e.g., MFA required)
      // we might need more specific logic based on the value of 'nextStep'
      console.warn("Sign in requires additional steps:", nextStep);
      return { 
          success: false, 
          message: `Further steps required: ${nextStep.signInStep}` // Provide more context
      };
    }
  } catch (error: any) {
    // Handle specific Cognito errors for better user feedback
    console.error("Error signing in:", error);
    let errorMessage = "Login failed. Please check your credentials.";
    
    // Check error type for more specific messages
    if (error.name === 'UserNotFoundException') {
        errorMessage = "User with this email does not exist.";
    } else if (error.name === 'NotAuthorizedException') {
        errorMessage = "Incorrect email or password.";
    } else if (error.name === 'UserNotConfirmedException') {
        errorMessage = "User account is not confirmed. Please check your email.";
        //  might want to add logic here to resend confirmation code
    } 
    
    return { success: false, message: errorMessage };
  }
}

// FOR LATER : Add a signOut function for logging users out
export async function signOutApi(): Promise<{ success: boolean; message: string }> {
  try {
    await signOut();
    return { success: true, message: "Sign out successful" };
  } catch (error: any) {
    console.error('Error signing out: ', error);
    return { success: false, message: error.message || "Sign out failed" };
  }
}


