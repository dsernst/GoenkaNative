import React from 'react'
import { ScrollView } from 'react-native'
import Entypo from 'react-native-vector-icons/Entypo'
import Ionicons from 'react-native-vector-icons/Ionicons'
import Octicons from 'react-native-vector-icons/Octicons'

import BackButton from '../BackButton'
import { Props } from '../reducer'
import TitleBar from '../TitleBar'
import AuthedInfo from './AuthedInfo'
import DailyNotificationSettings from './DailyNotifications'
import Friends from './Friends/Friends'
import MoreInfoSection from './MoreInfo'
import Section from './Section'
import Sync from './Sync/Sync'

function SettingsScreen(props: Props) {
  const { onlineSits, pendingFriendRequests, user } = props
  console.log({ onlineSits: onlineSits.length, pendingFriendRequests: pendingFriendRequests.length })
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
          Content={Friends}
          icon={{ Set: Ionicons, name: 'ios-people', size: 23 }}
          requiresLogin
          title="Friend notifications"
        />

        <Section
          Content={Sync}
          icon={{ Set: Octicons, name: 'sync', size: 19 }}
          requiresLogin
          title="Backup your sit history"
        />

        {user && <AuthedInfo user={user} />}

        <MoreInfoSection />
      </ScrollView>

      <BackButton saveSpace />
    </>
  )
}

export default SettingsScreen
