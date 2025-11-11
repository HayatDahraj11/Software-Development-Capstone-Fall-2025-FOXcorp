import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { Amplify } from 'aws-amplify';
import awsconfig from '@/src/aws-exports';
// Corrected path to the local hook in app-example
import { useColorScheme } from '../hooks/use-color-scheme'; 
Amplify.configure(awsconfig);
export default function RootLayout() {
  const colorScheme = useColorScheme(); 

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        {}
        <Stack.Screen name="index" options={{ headerShown: false }} /> 
        <Stack.Screen name="login" options={{ headerShown: false }} /> 
        <Stack.Screen name="(parent)" options={{ headerShown: false }} />
        <Stack.Screen name="(teacher)" options={{ headerShown: false }} />
        {}
      </Stack>
      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} /> 
    </ThemeProvider>
  );
}