import { Platform } from 'react-native'
import OneSignal from 'react-native-onesignal'

import { setStatePayload } from './reducer'

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

    if (openResult.notification.payload.body.includes('New friend request')) {
      setState({ expandFriendsSection: true, screen: 'SettingsScreen' })
    }
  }
}
