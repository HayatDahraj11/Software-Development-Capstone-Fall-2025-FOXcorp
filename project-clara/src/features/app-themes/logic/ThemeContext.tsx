import { useColorScheme as useSystemColorScheme } from 'nativewind';
import React, { createContext, useCallback, useContext, useState } from 'react';

type ThemeMode = 'light' | 'dark';

interface ThemeContextType {
  theme: ThemeMode;
  systemTheme: ThemeMode; // the os's current theme, stored to be referenced later
  setTheme: (theme: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function AppThemeProvider({ children }: { children: React.ReactNode }) {
  const {colorScheme} = useSystemColorScheme();
  const systemTheme = colorScheme === "dark" ? "dark" : "light";
  const [theme, setThemeState] = useState<ThemeMode>(
    colorScheme === 'dark' ? 'dark' : 'light'
  );

  const setTheme = useCallback((newTheme: ThemeMode) => {
    setThemeState(newTheme);
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, systemTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useAppTheme(): ThemeContextType {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useAppTheme must be used within an AppThemeProvider');
  }
  return context;
}

// Drop-in replacement for React Native's useColorScheme
// Returns 'light' | 'dark' (never null) so existing code works seamlessly
export function useAppColorScheme(): 'light' | 'dark' {
  const context = useContext(ThemeContext);
  if (!context) {
    // Should not happen — AppThemeProvider wraps the entire app in _layout.tsx
    return 'light';
  }
  return context.theme;
}
