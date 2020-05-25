import React from 'react'
import { ScrollView } from 'react-native'
import Entypo from 'react-native-vector-icons/Entypo'
import Ionicons from 'react-native-vector-icons/Ionicons'
import Octicons from 'react-native-vector-icons/Octicons'

import BackButton from '../BackButton'
import { Props } from '../reducer'
import TitleBar from '../TitleBar'
import AirplaneMode from './AirplaneMode'
import AuthedInfo from './AuthedInfo'
import DailyNotificationSettings from './DailyNotifications'
import Friends from './Friends/Friends'
import MoreInfoSection from './MoreInfo'
import Section from './Section'
import Sync from './Sync/Sync'

const SettingsScreen = (props: Props) => {
  const {
    displayName,
    history,
    incomingFriendRequests,
    notifications_allowed,
    onlineSits,
    recentlyJoinedContacts,
    user,
  } = props
  return (
    <>
      <TitleBar name="SETTINGS" showVersion style={{ marginBottom: 1, marginHorizontal: 18 }} />

      <ScrollView indicatorStyle="white" style={{ paddingHorizontal: 20, paddingTop: 17 }}>
        {user && <AuthedInfo {...props} user={user} />}

        <Section
          Content={AirplaneMode}
          description="Can help block incoming distractions."
          icon={{ Set: Ionicons, name: 'md-airplane', size: 19 }}
          title="Airplane mode"
        />

        <Section
          badgeNumber={user ? history.length - onlineSits?.length : 0}
          Content={Sync}
          description="Sync your sit history to the cloud, in case you lose your device."
          icon={{ Set: Octicons, name: 'sync', size: 19 }}
          requiresLogin
          title="Backup your sit history"
        />

        <Section
          Content={DailyNotificationSettings}
          description="Daily reminders to sit. Only shown if you haven't sat yet."
          icon={{ Set: Entypo, name: 'notification', size: 17 }}
          title="Daily notifications"
        />

        <Section
          badgeNumber={
            Number(user && (!displayName || !notifications_allowed)) +
            incomingFriendRequests.length +
            recentlyJoinedContacts.length
          }
          Content={Friends}
          description="Notify friends when either of you complete a sit."
          icon={{ Set: Ionicons, name: 'ios-people', size: 23 }}
          requiresLogin
          startExpandedKey="expandFriendsSection"
          title="Friend notifications"
        />

        <MoreInfoSection />
      </ScrollView>

      <BackButton saveSpace />
    </>
  )
}

SettingsScreen.paddingHorizontal = 2

export default SettingsScreen
