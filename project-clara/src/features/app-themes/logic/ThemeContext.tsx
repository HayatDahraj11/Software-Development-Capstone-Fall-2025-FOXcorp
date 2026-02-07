import React, { createContext, useCallback, useContext, useState } from 'react';
import { useColorScheme as useSystemColorScheme } from 'react-native';

type ThemeMode = 'light' | 'dark';

interface ThemeContextType {
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function AppThemeProvider({ children }: { children: React.ReactNode }) {
  const systemTheme = useSystemColorScheme();
  const [theme, setThemeState] = useState<ThemeMode>(
    systemTheme === 'dark' ? 'dark' : 'light'
  );

  const setTheme = useCallback((newTheme: ThemeMode) => {
    setThemeState(newTheme);
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
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
