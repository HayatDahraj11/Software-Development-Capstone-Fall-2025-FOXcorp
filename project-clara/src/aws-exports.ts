// src/aws-exports.ts
const awsconfig = {
  Auth: {
    Cognito: {
      userPoolId: 'us-east-1_4PIyHXV77',
      userPoolClientId: '3uh0uogbiksicgn7pknj1tk8g6',
      region: 'us-east-1',
    }
  },
  API: {
    GraphQL: {
      endpoint: 'https://4swn2sx4znarpjr56xia3nlqba.appsync-api.us-east-1.amazonaws.com/graphql',
      region: 'us-east-1',
      defaultAuthMode: 'apiKey',
      apiKey: 'da2-qeswxhbdxvdhnn2xdupi7aduuy'
    }
  }
};

export default awsconfig;