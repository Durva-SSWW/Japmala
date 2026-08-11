import { View } from 'react-native';
import { useDevice } from '../utils/responsive/device';
import { spacing } from '../utils/responsive/spacing';

const ResponsiveContainer = ({ 
  children, 
  style, 
  maxWidth = 'xl',
  centered = false,
  ...props 
}) => {
  const { isTablet, breakpoints } = useDevice();
  
  const containerStyle = {
    flex: 1,
    width: '100%',
    alignSelf: 'center',
    paddingHorizontal: spacing.screenHorizontal,
    ...(isTablet && centered && { alignItems: 'center' }),
    ...(isTablet && { maxWidth: breakpoints[maxWidth] || breakpoints.xl }),
  };

  return (
    <View style={[containerStyle, style]} {...props}>
      {children}
    </View>
  );
};

export default ResponsiveContainer;