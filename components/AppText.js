// import { Text } from 'react-native';
// import { typography } from '../utils/responsive/typography';
// import { Colors } from '../constants/Colors';

// const AppText = ({
//   children,
//   variant = 'body',
//   color = 'textPrimary',
//   align,
//   style,
//   ...props
// }) => {
//   const textStyle = typography[variant];

//   return (
//     <Text
//       {...props}
//       allowFontScaling
//       style={[
//         {
//           fontSize: textStyle.fontSize,
//           lineHeight: textStyle.lineHeight,
//           fontFamily: textStyle.fontFamily,
//           color: Colors[color],
//           hookup: undefined,
//           textAlign: align,
//         },
//         style,
//       ]}
//     >
//       {children}
//     </Text>
//   );
// };

// export default AppText;



import { Text } from 'react-native';
import { typography } from '../utils/responsive/typography';
import { useThemeColor } from '../hooks/useThemeColor';
import { useDevice } from '../utils/responsive/device';

// Map your variant names to the typography keys
const variantMap = {
  // Your exact naming
  'display-title': 'display',
  'heading-h1': 'h1',
  'heading-h2': 'h2',
  'heading-h3': 'h3',
  'heading-h4': 'h4',
  'body-large': 'bodyLarge',
  'body-standard': 'body',
  'body-small': 'bodySmall',
  'caption-micro': 'caption',
  
  // Legacy support
  'display': 'display',
  'h1': 'h1',
  'h2': 'h2',
  'h3': 'h3',
  'h4': 'h4',
  'bodyLarge': 'bodyLarge',
  'body': 'body',
  'bodySmall': 'bodySmall',
  'caption': 'caption',
};

const AppText = ({
  children,
  variant = 'body-standard', // Default to your body-standard
  color = 'text',
  align,
  style,
  numberOfLines,
  ellipsizeMode,
  allowFontScaling = true,
  maxFontSizeMultiplier = 1.5,
  adjustForTablet = true,
  ...props
}) => {
  const { isTablet } = useDevice();
  const colorValue = useThemeColor({}, color);
  
  // Get the actual variant key
  const variantKey = variantMap[variant] || 'body';
  const textStyle = typography[variantKey] || typography.body;

  // Tablet adjustments (slightly larger on tablets)
  const fontSizeMultiplier = adjustForTablet && isTablet ? 1.15 : 1;
  const lineHeightMultiplier = adjustForTablet && isTablet ? 1.1 : 1;

  return (
    <Text
      {...props}
      allowFontScaling={allowFontScaling}
      maxFontSizeMultiplier={maxFontSizeMultiplier}
      numberOfLines={numberOfLines}
      ellipsizeMode={ellipsizeMode}
      style={[
        {
          fontSize: textStyle.fontSize * fontSizeMultiplier,
          lineHeight: textStyle.lineHeight * lineHeightMultiplier,
          fontFamily: textStyle.fontFamily,
          color: colorValue,
          textAlign: align,
          letterSpacing: textStyle.letterSpacing,
          includeFontPadding: false,
          textAlignVertical: 'center',
        },
        style,
      ]}
    >
      {children}
    </Text>
  );
};

export default AppText;