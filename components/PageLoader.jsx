import { View, Text, ActivityIndicator, StyleSheet } from 'react-native'
import { COLORS } from '../constants/colors'

export default function PageLoader() {
  return (
    <View style={styles.loaderContainer}>
      <ActivityIndicator size="large" color={COLORS.primary} />
      <Text style={styles.loadingText}>Loading...</Text>   
    </View>
  )
}

const styles= StyleSheet.create({
    loaderContainer:{
        flex:1,
        justifyContent:'center',
        alignItems:'center',
    },
    loadingText:{
        marginTop:10,
        fontSize:16,
        color:COLORS.textSecondary,
    }
})