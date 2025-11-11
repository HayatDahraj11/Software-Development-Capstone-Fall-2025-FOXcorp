const awsconfig = {
  Auth: {
    Cognito: {
      region: 'us-east-1',
      userPoolId: 'us-east-1_4PIyHXV77',
      userPoolClientId: '3uh0uogbiksicgn7pknj1tk8g6',
    },
    // Keep legacy key for compatibility
    userPoolWebClientId: '3uh0uogbiksicgn7pknj1tk8g6',
    mandatorySignIn: true,
  }
};

export default awsconfig;
