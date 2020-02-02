import React, { Component } from 'react'
import { Text, TouchableOpacity } from 'react-native'

import { Props } from '../reducer'
import TitleBar from '../TitleBar'
import DailyNotificationSettings from './DailyNotifications'
import MoreInfoSection from './MoreInfo'

class SettingsScreen extends Component<Props> {
  render() {
    const { setState } = this.props

    return (
      <>
        <TitleBar name="SETTINGS" showVersion />

        <DailyNotificationSettings {...this.props} />

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
