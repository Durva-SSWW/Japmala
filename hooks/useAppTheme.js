import React from 'react';
import { useColorScheme } from "react-native";
import { colors } from '../constants/Colors';

export const useAppTheme = () => {
  const systemTheme = useColorScheme();
  const theme = systemTheme === 'dark' ? 'dark' : 'light';
  
  // Memoize the colors to prevent unnecessary recalculations
  const colors = React.useMemo(() => {
    if (!colors[theme]) {
      console.warn(`Theme '${theme}' not found. Using light theme.`);
      return colors.light;
    }
    return colors[theme];
  }, [theme]);

  const isDarkMode = theme === 'dark';

  return {
    colors,
    theme,
    isDarkMode
  };
};

export const useAppColors = () => useAppTheme().colors;