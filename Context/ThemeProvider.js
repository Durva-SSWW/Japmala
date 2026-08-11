

import React, { createContext, useContext } from 'react';
import { useAppTheme } from '../hooks/useAppTheme';
import { SafeAreaProvider } from 'react-native-safe-area-context';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const theme = useAppTheme();

  return (
    <ThemeContext.Provider value={theme}>
      <SafeAreaProvider>
        {children}
      </SafeAreaProvider>
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};