import PushNotificationIOS from '@react-native-community/push-notification-ios';
import dayjs from 'dayjs';
import {Platform} from 'react-native';
import PushNotification from 'react-native-push-notification';

import {Sit} from '../reducer';

export default function setDailyNotifications(
  amNotification: boolean,
  amNotificationTime: Date,
  pmNotification: boolean,
  pmNotificationTime: Date,
  history: Sit[],
) {
  console.log('📆 Updating local notifications');

  // Clear old notifications
  PushNotification.cancelAllLocalNotifications();

  // Did we already sit today?
  const numSitsToday = history.filter(sit =>
    dayjs().isSame(dayjs(sit.date), 'day'),
  ).length;
  const dailyGoal = amNotification ? 2 : 1;

  // Set new notifications
  const notificationTuple: [boolean, Date][] = [
    [amNotification, calcNext(amNotificationTime, numSitsToday >= 1)],
    [pmNotification, calcNext(pmNotificationTime, numSitsToday >= dailyGoal)],
  ];

  notificationTuple.forEach(([isOn, time]) => {
    if (isOn) {
      scheduleNotification(time);
    }
  });
}

function scheduleNotification(time: Date) {
  const title = `${dayjs(time).format('h[:]mma')} sit`;
  const body = 'Awareness & Equanimity';
  const soundName = 'templebell.mp3';

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
    });
  } else {
    // iOS gets an application badge number
    PushNotificationIOS.scheduleLocalNotification({
      alertBody: body,
      alertTitle: title,
      applicationIconBadgeNumber: 1,
      fireDate: time.toISOString(),
      repeatInterval: 'day',
      soundName,
    });
  }
}

function calcNext(date: Date, metGoalToday: boolean) {
  // Make sure we are only setting notifications for dates in the future,
  // to avoid Android going crazy showing backlogged notifications.
  // see: https://github.com/zo0r/react-native-push-notification/issues/374#issuecomment-396089990

  const now = dayjs();

  // 1) set nextNotifTime date to today
  let nextNotificationTime = dayjs(date)
    .year(now.year())
    .month(now.month())
    .date(now.date());

  if (
    // IF nextNotifTime date is < right now
    nextNotificationTime.isBefore(now) ||
    // OR IF we already metGoalToday
    metGoalToday
  ) {
    //  THEN add 1day to NotifTime
    nextNotificationTime = nextNotificationTime.add(1, 'day');
  }

  return nextNotificationTime.toDate();
}
