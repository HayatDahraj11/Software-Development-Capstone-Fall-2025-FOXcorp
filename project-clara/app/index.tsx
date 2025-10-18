// In app/index.tsx

import { Redirect } from 'expo-router';

export default function RootIndex() {
  //  I Changed this to point to the school selection screen, as the initial screen
  return <Redirect href="/login/school-selection" />;
}