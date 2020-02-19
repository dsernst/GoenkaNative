import React from 'react'
import { Text, TouchableOpacity } from 'react-native'
import Ionicons from 'react-native-vector-icons/Ionicons'
import Octicons from 'react-native-vector-icons/Octicons'

import BackButton from '../BackButton'
import { Props } from '../reducer'
import TitleBar from '../TitleBar'
import DailyNotificationSettings from './DailyNotifications'
import MoreInfoSection from './MoreInfo'

function SettingsScreen(props: Props) {
  return (
    <>
      <TitleBar name="SETTINGS" showVersion />
      <DailyNotificationSettings {...props} />

      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => props.setState({ screen: 'SyncScreen' })}
        style={{
          alignItems: 'center',
          alignSelf: 'center',
          borderColor: '#fff7',
          borderRadius: 8,
          borderWidth: 1,
          flexDirection: 'row',
          height: 39,
          marginTop: 50,
          paddingHorizontal: 15,
        }}
      >
        <Octicons color="#fffa" name="sync" size={18} style={{ paddingLeft: 4, paddingTop: 2, width: 30 }} />
        <Text style={{ color: '#fff9', fontSize: 18 }}>Backup your sit history</Text>
        <Octicons
          color="#fff5"
          name={'chevron-right'}
          size={18}
          style={{ paddingLeft: 24, paddingTop: 3, width: 35 }}
        />
      </TouchableOpacity>

      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => props.setState({ screen: 'FriendsScreen' })}
        style={{
          alignItems: 'center',
          alignSelf: 'center',
          borderColor: '#fff7',
          borderRadius: 8,
          borderWidth: 1,
          flexDirection: 'row',
          height: 39,
          marginTop: 30,
          paddingHorizontal: 15,
        }}
      >
        <Ionicons color="#fffa" name="ios-people" size={25} style={{ paddingLeft: 1, paddingTop: 4, width: 39 }} />
        <Text style={{ color: '#fff9', fontSize: 18 }}>Friend Notifications</Text>
        <Octicons
          color="#fff5"
          name={'chevron-right'}
          size={18}
          style={{ paddingLeft: 24, paddingTop: 3, width: 35 }}
        />
      </TouchableOpacity>

      <MoreInfoSection />

      <BackButton />
    </>
  )
}

export default SettingsScreen
