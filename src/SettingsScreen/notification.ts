import PushNotificationIOS from '@react-native-community/push-notification-ios'
import dayjs from 'dayjs'
import { Platform } from 'react-native'
import PushNotification from 'react-native-push-notification'

export default function scheduleNotification(time: Date) {
  const title = `${dayjs(time).format('h[:]mma')} sit`
  const body = 'Awareness & Equanimity'
  const soundName = 'templebell.mp3'

  if (Platform.OS === 'android') {
    PushNotification.localNotificationSchedule({
      color: 'yellow',
      date: time,
      largeIcon: 'ic_stat_ic_launcher',
      message: body,
      repeatType: 'day',
      smallIcon: 'ic_stat_ic_launcher',
      soundName,
      title,
    })
  } else {
    // iOS gets an application badge number
    PushNotificationIOS.scheduleLocalNotification({
      alertBody: body,
      alertTitle: title,
      applicationIconBadgeNumber: 1,
      fireDate: time.toISOString(),
      repeatInterval: 'day',
      soundName,
    })
  }
}
