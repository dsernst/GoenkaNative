import PushNotificationIOS from '@react-native-community/push-notification-ios'
import firestore from '@react-native-firebase/firestore'
import { Platform } from 'react-native'
import { Alert } from 'react-native'
import OneSignal from 'react-native-onesignal'

import { Props, setStatePayload } from './reducer'

function init(setState: (payload: setStatePayload) => void) {
  OneSignal.init('bcfb2833-18d0-4b12-8e53-647f1068c5a8', {
    kOSSettingsKeyAutoPrompt: false,
    kOSSettingsKeyInFocusDisplayOption: 2,
  })

  OneSignal.addEventListener('received', onReceived)
  OneSignal.addEventListener('opened', onOpened(setState))
  OneSignal.addEventListener('ids', saveId)

  if (Platform.OS === 'android') {
    setState({ notifications_allowed: true })
  } else {
    OneSignal.checkPermissions(osLevelPermissions => {
      setState({ notifications_allowed: !!osLevelPermissions.alert })
    })
  }

  function saveId(device: any) {
    // console.log('OneSignal Device info: ', device)
    setState({ onesignal_id: device.userId })
  }

  return () => {
    OneSignal.removeEventListener('received', onReceived)
    OneSignal.removeEventListener('opened', onOpened)
    OneSignal.removeEventListener('ids', saveId)
  }
}

export default { init }

function onReceived(notification: any) {
  console.log('Notification received: ', notification)
}

function onOpened(setState: (payload: setStatePayload) => void) {
  return (openResult: any) => {
    console.log('Message: ', openResult.notification.payload.body)
    console.log('Data: ', openResult.notification.payload.additionalData)
    console.log('isActive: ', openResult.notification.isAppInFocus)
    console.log('openResult: ', openResult)

    const body = openResult.notification.payload.body
    if (body.includes('New friend request') || body.includes('Go send them a friend request')) {
      setState({ expandFriendsSection: true, screen: 'SettingsScreen' })
    }
    const data = openResult.notification.payload?.additionalData // could be .data
    if (data.hasOwnProperty('possibleGroupMed')) {
      Alert.alert(
        'Group Meditation?',
        `Did you participated with ${data?.friendName} in their ${data?.duration} min session?`,
        [
          {
            onPress: () => console.log('No Pressed'),
            style: 'cancel',
            text: 'No',
          },
          {
            onPress: () => (props: Props) => addMinsToUser(props, data?.duration),
            text: 'Yes',
          },
        ],
      )
    }
  }
}

async function addMinsToUser(props: any, duration: string) {
  const { autoSyncCompletedSits, user } = props

  console.log('...Attempting to autoSync completed sit')
  if (!user) {
    return console.log('  Not logged in.')
  }

  if (!autoSyncCompletedSits) {
    return console.log('  AutoSync disabled.')
  }

  const durationInt = parseInt(duration, 10)
  setTimeout(async () => {
    await firestore()
      .collection('sits')
      .add({ durationInt, user_id: user.uid, user_phone: user.phoneNumber })
    console.log('⬆️  Autosync complete.')
  }, 500)

  // Clear Notification Center reminders
  if (Platform.OS === 'ios') {
    PushNotificationIOS.removeAllDeliveredNotifications()
  }
}
