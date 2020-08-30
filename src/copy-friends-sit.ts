import firestore from '@react-native-firebase/firestore'
import { Alert } from 'react-native'
import OneSignal from 'react-native-onesignal'

import { Props, Sit } from './reducer'
import setDailyNotifications from './SettingsScreen/notification'

export function copyFriendsSit(
  additionalData: {
    p2p_notification: {
      host_name: string
      host_onesignal: string
      host_phone: string
      sit: Sit
      sit_date: string
    }
  },
  props: Props,
) {
  const { host_name, host_onesignal, host_phone, sit, sit_date } = additionalData.p2p_notification
  const {
    amNotification,
    amNotificationTime,
    autoSyncCompletedSits,
    displayName,
    history,
    pmNotification,
    pmNotificationTime,
    setState,
    user,
  } = props

  const newSit = { ...sit, date: new Date(sit_date), host_name, host_phone }

  Alert.alert('Group Meditation?', `Did you sit with ${host_name} for ${sit.duration} min?`, [
    {
      onPress: () => console.log("Pressed `no`, didn't group sit"),
      style: 'cancel',
      text: 'No',
    },
    {
      onPress: () => {
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
      },
      text: 'Yes',
    },
  ])
}
