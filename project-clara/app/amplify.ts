import { Amplify } from 'aws-amplify';
import awsconfigImport from '../src/aws-exports';

// Support both ESM default export and CommonJS interop where module may be { default: {...} }
const awsconfigRaw = (awsconfigImport as any)?.default ?? awsconfigImport;

// Basic validation and normalization
let awsconfig: any = awsconfigRaw;
if (awsconfig && typeof awsconfig === 'object') {
  const auth = awsconfig.Auth ?? {};
  const clientId = auth.userPoolWebClientId ?? auth.userPoolClientId;
  awsconfig = {
    ...awsconfig,
    Auth: {
      ...auth,
      // ensure both possible keys exist — some Amplify versions expect one or the other
      userPoolWebClientId: auth.userPoolWebClientId ?? clientId,
      userPoolClientId: auth.userPoolClientId ?? clientId,
    },
  };
}

if (!awsconfig || typeof awsconfig !== 'object') {
  // Avoid crashing the app during startup it will kind of  log a helpful message instead
  
  console.warn('Amplify configuration is missing or invalid. Skipping Amplify.configure().', awsconfigImport);
} else {
  try {
    Amplify.configure(awsconfig);
  } catch (err) {
  
    console.error('Error calling Amplify.configure:', err);
  }
}

export default Amplify;
