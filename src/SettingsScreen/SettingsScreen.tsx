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

const SettingsScreen = (props: Props) => {
  const { displayName, history, incomingFriendRequests, onlineSits, user } = props
  return (
    <>
      <TitleBar name="SETTINGS" showVersion style={{ marginBottom: 1, marginHorizontal: 18 }} />

      <ScrollView indicatorStyle="white" style={{ paddingHorizontal: 20, paddingTop: 17 }}>
        {user && <AuthedInfo {...props} user={user} />}

        <Section
          Content={DailyNotificationSettings}
          description="Turn on daily reminders to sit."
          icon={{ Set: Entypo, name: 'notification', size: 17 }}
          title="Daily notifications"
        />

        <Section
          badgeNumber={incomingFriendRequests.length + Number(user && !displayName)}
          Content={Friends}
          description="Get notified when friends complete a sit."
          icon={{ Set: Ionicons, name: 'ios-people', size: 23 }}
          requiresLogin
          startExpandedKey="expandFriendsSection"
          title="Friend notifications"
        />

        <Section
          badgeNumber={user ? history.length - onlineSits?.length : 0}
          Content={Sync}
          description="Backup your sit history to the cloud, in case you lose your device, etc."
          icon={{ Set: Octicons, name: 'sync', size: 19 }}
          requiresLogin
          title="Backup your sit history"
        />

        <MoreInfoSection />
      </ScrollView>

      <BackButton saveSpace />
    </>
  )
}

SettingsScreen.paddingHorizontal = 2

export default SettingsScreen
