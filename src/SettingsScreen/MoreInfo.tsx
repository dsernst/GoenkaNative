import React from 'react'
import { Linking, Platform, Text, View } from 'react-native'
import Ionicons from 'react-native-vector-icons/Ionicons'

export default () => (
  <View style={{ flexDirection: 'row', marginRight: 30, marginTop: 90 }}>
    <Ionicons
      color="#fff8"
      name="ios-information-circle-outline"
      size={24}
      style={{ marginLeft: -2, marginTop: 9, paddingRight: 17 }}
    />
    <View>
      {/* Apple prohibits referencing "third-party platforms" (Android) */}
      {Platform.OS !== 'ios' && (
        <Text style={{ color: '#fffa', fontSize: 16, lineHeight: 27, marginBottom: 15 }}>
          GoenkaTimer is available for both{'\n'}
          <Link url="https://apps.apple.com/us/app/id1494609891">
            <Ionicons name="logo-apple" size={22} />
            &nbsp; iOS&nbsp;
          </Link>{' '}
          and{' '}
          <Link url="https://play.google.com/store/apps/details?id=com.goenkanative">
            &nbsp;&nbsp;
            <Ionicons name="logo-android" size={22} />
            &nbsp; Android
          </Link>
          .
        </Text>
      )}
      <Text style={{ color: '#fffa', fontSize: 16, lineHeight: 27 }}>
        For more info about S.N. Goenka or Vipassana meditation, visit{' '}
        <Link url="https://www.dhamma.org">dhamma.org</Link>.
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
