import firestore from '@react-native-firebase/firestore'
import React from 'react'
import { Text, TouchableOpacity, View } from 'react-native'
import OneSignal from 'react-native-onesignal'
import Feather from 'react-native-vector-icons/Feather'
import Ionicons from 'react-native-vector-icons/Ionicons'

import BackButton from './BackButton'
import { Props } from './reducer'
import setDailyNotifications from './SettingsScreen/notification'
import TitleBar from './TitleBar'

const FriendsSitScreen = ({
  amNotification,
  amNotificationTime,
  autoSyncCompletedSits,
  displayName,
  friendsSit,
  history,
  pmNotification,
  pmNotificationTime,
  setState,
  user,
}: Props) => {
  if (!friendsSit) {
    return (
      <>
        <Text style={{ color: '#fffa', margin: 30 }}>Loading...</Text>
        <BackButton text="Done" />
      </>
    )
  }

  const { host_name, host_onesignal, host_phone, sit, sit_date } = friendsSit

  return (
    <>
      <TitleBar name="FRIENDS SIT" />

      <Ionicons color="#fff4" name="ios-people" size={83} style={{ alignSelf: 'center', marginBottom: 40 }} />
      <View style={{ paddingHorizontal: 20 }}>
        <Text style={{ color: '#fffc', fontSize: 18, lineHeight: 26 }}>
          Your friend {host_name} sat for {sit?.duration} minutes.
        </Text>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => {
            const newSit = { ...sit, date: new Date(sit_date), host_name, host_phone }

            // Add to history
            const newHistory = [newSit, ...history]
            setState({ history: newHistory, screen: 'HistoryScreen' })

            // Send reply to host that sit was copied
            OneSignal.postNotification(
              {
                en: `${displayName} said they sat with you 🙂`,
              },
              {},
              [host_onesignal],
            )

            // Update daily notifications
            setDailyNotifications(amNotification, amNotificationTime, pmNotification, pmNotificationTime, newHistory)

            // Sync sit to cloud
            if (!user) {
              return console.log('  Not logged in.')
            }
            if (!autoSyncCompletedSits) {
              return console.log('  AutoSync disabled.')
            }
            setTimeout(async () => {
              await firestore()
                .collection('sits')
                .add({ ...newSit, user_id: user.uid, user_phone: user.phoneNumber })
              console.log('⬆️  Autosync complete.')
            }, 500)
          }}
          style={{
            alignItems: 'center',
            alignSelf: 'center',
            borderColor: '#fff3',
            borderRadius: 5,
            borderWidth: 1,
            flexDirection: 'row',
            marginTop: 30,
            paddingHorizontal: 20,
            paddingVertical: 10,
          }}
        >
          <Feather color="#fffa" name="copy" size={15} style={{ paddingRight: 12, paddingTop: 1 }} />
          <Text style={{ color: '#fff9', fontSize: 16, fontWeight: '500' }}>I sat with them</Text>
        </TouchableOpacity>
      </View>
      <BackButton text="Done" />
    </>
  )
}

FriendsSitScreen.paddingHorizontal = 2

export default FriendsSitScreen
