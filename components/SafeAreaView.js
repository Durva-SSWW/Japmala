import { SafeAreaView as RNSafeAreaView } from 'react-native-safe-area-context';
import { useDevice } from '../utils/responsive/device';
import { colors } from '../constants/Colors';

const SafeAreaView = ({ children, style, edges = ['top', 'bottom'], ...props }) => {
  const { isIOS } = useDevice();

  return (
    <RNSafeAreaView
      {...props}
      edges={edges}
      style={[
        {
          flex: 1,
          backgroundColor: colors.background,
        },
        style,
      ]}
    >
      {children}
    </RNSafeAreaView>
  );
};

export default SafeAreaView;