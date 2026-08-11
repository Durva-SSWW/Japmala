// hooks/useThemeColor.js

import { colors } from '../constants/Colors';
import { useColorScheme } from './useColorScheme';

export function useThemeColor(props, colorName) {
  const theme = useColorScheme() ?? 'light';
  const colorFromProps = props[theme];

  if (colorFromProps) {
    return colorFromProps;
  } else {
    return colors[theme][colorName];
  }
}