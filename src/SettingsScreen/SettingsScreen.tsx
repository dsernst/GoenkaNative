import React, { Component } from 'react'
import { Linking, Text, TouchableOpacity, View } from 'react-native'
import Ionicons from 'react-native-vector-icons/Ionicons'

import { version } from '../../package.json'
import { Props } from '../reducer'
import DailyNotificationSettings from './DailyNotifications'

class SettingsScreen extends Component<Props> {
  render() {
    const { setState } = this.props

    return (
      <>
        {/* Page title bar */}
        <View
          style={{
            borderBottomWidth: 1,
            borderColor: '#fff3',
            borderTopWidth: 1,
            marginVertical: 25,
            paddingVertical: 7,
          }}
        >
          <Text
            style={{
              alignSelf: 'center',
              color: '#fffc',
              fontSize: 11,
              fontWeight: '500',
            }}
          >
            SETTINGS
          </Text>
          <Text style={{ color: '#fff3', fontSize: 11, position: 'absolute', right: 0, top: 7 }}>v{version}</Text>
        </View>

        {/* Daily Notification Settings */}
        <DailyNotificationSettings {...this.props} />

        {/* More Info section */}
        <View style={{ flexDirection: 'row', marginRight: 30, marginTop: 90 }}>
          <Ionicons
            color="#fff8"
            name="ios-information-circle-outline"
            size={24}
            style={{ marginLeft: -2, marginTop: 9, paddingRight: 17 }}
          />
          <View>
            <Text style={{ color: '#fffa', fontSize: 16, lineHeight: 27 }}>
              GoenkaTimer is available for both{'\n'}
              <Link url="https://apps.apple.com/us/app/id1494609891">
                <Ionicons name="logo-apple" size={27} />
                &nbsp; iOS&nbsp;
              </Link>{' '}
              and{' '}
              <Link url="https://play.google.com/store/apps/details?id=com.goenkanative">
                &nbsp;&nbsp;
                <Ionicons name="logo-android" size={27} />
                &nbsp; Android
              </Link>
              .
            </Text>
            <Text style={{ color: '#fffa', fontSize: 16, lineHeight: 27, marginTop: 15 }}>
              For more info about S.N. Goenka or Vipassana meditation, visit{' '}
              <Link url="https://www.dhamma.org">dhamma.org</Link>.
            </Text>
          </View>
        </View>

        {/* Back button */}
        <TouchableOpacity
          onPress={() => setState({ screen: 'InitScreen' })}
          style={{
            alignItems: 'center',
            marginTop: 'auto',
            marginVertical: 10,
            paddingBottom: 50,
            paddingTop: 15,
          }}
        >
          <Text style={{ color: 'white', fontSize: 18, opacity: 0.2 }}>Back</Text>
        </TouchableOpacity>
      </>
    )
  }
}

const Link = ({ url, ...otherProps }: { children: any; url: string }) => (
  <Text
    style={{ color: '#0070c9' }}
    {...otherProps}
    onPress={() => {
      Linking.openURL(url)
    }}
  />
)

export default SettingsScreen
