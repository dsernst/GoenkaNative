import React, { Component } from 'react'
import { Text, TouchableOpacity, View } from 'react-native'

import { version } from '../../package.json'
import { Props } from '../reducer'
import DailyNotificationSettings from './DailyNotifications'
import MoreInfoSection from './MoreInfo'

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
        <MoreInfoSection />

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

export default SettingsScreen
