import React from 'react'
import { Linking, Text, View } from 'react-native'
import Ionicons from 'react-native-vector-icons/Ionicons'

export default () => (
  <View style={{ flexDirection: 'row', marginRight: 30, marginTop: 60 }}>
    <Ionicons
      color="#fff8"
      name="ios-information-circle-outline"
      size={24}
      style={{ marginLeft: -2, marginTop: 9, paddingRight: 17 }}
    />
    <View>
      <Text style={{ color: '#fffa', fontSize: 16, lineHeight: 27 }}>
        For more info about S.N. Goenka or Vipassana meditation, visit{' '}
        <Link url="https://www.dhamma.org">dhamma.org</Link>.
      </Text>
      <Text style={{ color: '#fffa', fontSize: 16, lineHeight: 27, marginTop: 30, opacity: 1 }}>
        For help/questions: <Link url="mailto:hi@goenka.app">hi@goenka.app</Link>
      </Text>
    </View>
  </View>
)

const Link = ({ url, ...otherProps }: { children: any; url: string }) => (
  <Text
    style={{ color: '#0070c9' }}
    {...otherProps}
    onPress={() => {
      Linking.openURL(url)
    }}
  />
)
