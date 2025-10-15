import { Redirect } from 'expo-router';

export default function RootIndex() {
  {/* later on, the app will save whatever school was chosen by the user previously and open straight to login
    however, for now open straight to school-selection */}
  return <Redirect href="/login/school-selection" />;
}