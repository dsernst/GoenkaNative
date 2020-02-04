import React, { Component } from 'react'
import { Text, TouchableOpacity } from 'react-native'
import Octicons from 'react-native-vector-icons/Octicons'

import BackButton from '../BackButton'
import { Props } from '../reducer'
import TitleBar from '../TitleBar'
import DailyNotificationSettings from './DailyNotifications'
import MoreInfoSection from './MoreInfo'

class SettingsScreen extends Component<Props> {
  render() {
    return (
      <>
        <TitleBar name="SETTINGS" showVersion />

        <DailyNotificationSettings {...this.props} />

        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => this.props.setState({ screen: 'SyncScreen' })}
          style={{
            alignItems: 'center',
            alignSelf: 'center',
            borderColor: '#fff7',
            borderRadius: 8,
            borderWidth: 1,
            flexDirection: 'row',
            marginTop: 60,
            paddingHorizontal: 15,
            paddingVertical: 7,
          }}
        >
          <Octicons color="#fffa" name={'sync'} size={18} style={{ paddingLeft: 4, paddingTop: 2, width: 30 }} />
          <Text style={{ color: '#fff9', fontSize: 18 }}>Backup your sit history</Text>
          <Octicons color="#fff5" name={'chevron-right'} size={18} style={{ paddingLeft: 24, width: 35 }} />
        </TouchableOpacity>

        <MoreInfoSection />

        <BackButton />
      </>
    )
  }
}

export default SettingsScreen
