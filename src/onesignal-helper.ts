import { Platform } from 'react-native'
import OneSignal from 'react-native-onesignal'

import { Props } from './reducer'

function init(props: Props) {
  const { setState } = props

  OneSignal.init('bcfb2833-18d0-4b12-8e53-647f1068c5a8', {
    kOSSettingsKeyAutoPrompt: false,
    kOSSettingsKeyInFocusDisplayOption: 2,
  })

  OneSignal.addEventListener('received', onReceived)
  OneSignal.addEventListener('opened', onOpened(props))
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

function onOpened(props: Props) {
  const { setState } = props
  return (openResult: any) => {
    console.log('Message: ', openResult.notification.payload.body)
    console.log('Data: ', openResult.notification.payload.additionalData)
    console.log('isActive: ', openResult.notification.isAppInFocus)
    console.log('openResult: ', openResult)

    const body = openResult.notification.payload.body
    if (body.includes('New friend request') || body.includes('Go send them a friend request')) {
      setState({ expandFriendsSection: true, screen: 'SettingsScreen' })
    }
    if (body.includes(' just finished a ')) {
      setState({
        friendsSit: openResult.notification.payload.additionalData.p2p_notification,
        screen: 'FriendsSitScreen',
      })
    }
  }
}
