import { View, Text } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {COLORS} from '../constants/colors';

export default function SafeScreen({children}) {
    const insets = useSafeAreaInsets();

  return (
    <View style={{flex:1, paddingTop: insets.top, paddingBottom: insets.bottom, paddingLeft: insets.left, paddingRight: insets.right, backgroundColor:COLORS.background}}>
   {children}
    </View>
  )
}