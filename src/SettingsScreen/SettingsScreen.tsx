import React from 'react'
import { ScrollView } from 'react-native'
import Entypo from 'react-native-vector-icons/Entypo'
import Ionicons from 'react-native-vector-icons/Ionicons'
import Octicons from 'react-native-vector-icons/Octicons'

import BackButton from '../BackButton'
import TitleBar from '../TitleBar'
import DailyNotificationSettings from './DailyNotifications'
import FriendsScreen from './Friends/Friends'
import MoreInfoSection from './MoreInfo'
import Section from './Section'
import SyncScreen from './Sync/Sync'

function SettingsScreen() {
  return (
    <>
      <TitleBar name="SETTINGS" showVersion style={{ marginHorizontal: 17 }} />

      <ScrollView indicatorStyle="white" style={{ paddingHorizontal: 16 }}>
        <Section
          Content={DailyNotificationSettings}
          icon={{ Set: Entypo, name: 'notification', size: 17 }}
          title="Daily notifications"
        />

        <Section
          Content={FriendsScreen}
          icon={{ Set: Ionicons, name: 'ios-people', size: 23 }}
          title="Friend notifications"
        />

        <Section
          Content={SyncScreen}
          icon={{ Set: Octicons, name: 'sync', size: 19 }}
          title="Backup your sit history"
        />

        <MoreInfoSection />
      </ScrollView>

      <BackButton />
    </>
  )
}

export default SettingsScreen
