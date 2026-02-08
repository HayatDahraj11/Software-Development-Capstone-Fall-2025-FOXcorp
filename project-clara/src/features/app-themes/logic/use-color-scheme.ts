// Use our context-based theme instead of React Native's Appearance API.
// This avoids the native crash caused by Appearance.setColorScheme() on Android.
import { useAppColorScheme } from './ThemeContext';

export function useColorScheme(): 'light' | 'dark' {
  return useAppColorScheme();
}
