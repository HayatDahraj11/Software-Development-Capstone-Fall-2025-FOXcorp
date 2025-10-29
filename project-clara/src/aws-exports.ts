// src/aws-exports.ts

const awsconfig = {
  Auth: {
    Cognito: { // ALL Cognito config goes inside here
      region: 'us-east-1',
      userPoolId: 'us-east-1_4PIyHXV77',
      userPoolClientId: '3uh0uogbiksicgn7pknj1tk8g6',
      
    }
  }
  // Add other Amplify categories like API, Storage if needed later
};

export default awsconfig;