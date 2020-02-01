import React, { Component } from 'react'
import { Alert, Linking, Platform, Switch, Text, TouchableOpacity, View } from 'react-native'
import { Props } from './reducer'
import DateTimePickerModal from 'react-native-modal-datetime-picker'
import dayjs from 'dayjs'
import FeatherIcon from 'react-native-vector-icons/Feather'
import Ionicons from 'react-native-vector-icons/Ionicons'
import PushNotification from 'react-native-push-notification'
import { version } from './package.json'

type TimeKeys = 'morning' | 'evening'

function calcNext(date: Date) {
  // Make sure we are only setting notifications for dates in the future,
  // to avoid Android going crazy showing backlogged notifications.
  // see: https://github.com/zo0r/react-native-push-notification/issues/374#issuecomment-396089990

  const now = dayjs()

  // 1) set nextNotifTime date to today
  let nextNotificationTime = dayjs(date)
    .set('year', now.get('year'))
    .set('month', now.get('month'))
    .set('day', now.get('day'))

  // 2) IF nextNotifTime date is < right now
  if (nextNotificationTime.isBefore(now)) {
    //  THEN add 1day to NotifTime
    nextNotificationTime = nextNotificationTime.add(1, 'day')
  }

  return nextNotificationTime.toDate()
}

class SettingsScreen extends Component<Props> {
  state = {
    amPickerVisible: false,
    pmPickerVisible: false,
  }

  componentDidUpdate() {
    // Props changed, probably because settings were adjusted
    // Now reset local notifications
    const { amNotification, amNotificationTime, pmNotification, pmNotificationTime } = this.props

    // Clear old notifications
    PushNotification.cancelAllLocalNotifications()

    // Set new notifications
    const notificationTuple: [boolean, Date][] = [
      [amNotification, calcNext(amNotificationTime)],
      [pmNotification, calcNext(pmNotificationTime)],
    ]
    notificationTuple.forEach(([isOn, time]) => {
      if (isOn) {
        PushNotification.localNotificationSchedule({
          date: time,
          message: 'Awareness & Equanimity',
          repeatType: 'day',
          soundName: 'templebell.mp3',
          title: `${dayjs(time).format('h[:]mma')} sit`,
        })
      }
    })
  }

  async toggleNotification(key: TimeKeys) {
    const { amNotification, pmNotification, setState } = this.props

    // Check iOS notification permissions
    type iosPermission = {
      alert?: boolean
      badge?: boolean
      sound?: boolean
    }
    let permissions: iosPermission = await new Promise(resolve => PushNotification.checkPermissions(resolve))
    if (!permissions.alert) {
      PushNotification.requestPermissions()
      permissions = await new Promise(resolve => PushNotification.checkPermissions(resolve))
      if (!permissions.alert) {
        Alert.alert(
          'You blocked this app from showing Notifications.',
          'To re-enable, go to Settings.app > Notifications > GoenkaTimer.',
        )
        return
      }
    }

    // Persist new notification state
    if (key === 'morning') {
      setState({ amNotification: !amNotification })
    } else if (key === 'evening') {
      setState({ pmNotification: !pmNotification })
    }
  }

  render() {
    const { amNotification, amNotificationTime, pmNotification, pmNotificationTime, setState } = this.props

    const morningYellow = 'rgb(255, 204, 0)'
    const eveningPurple = 'rgb(175, 82, 222)'

    const TimeSwitchesTuples: [TimeKeys, string, boolean, typeof Ionicons, string][] = [
      ['morning', morningYellow, amNotification, FeatherIcon, 'sun'],
      ['evening', eveningPurple, pmNotification, Ionicons, 'ios-moon'],
    ]

    const AdjustTimeTuples: [boolean, object, object, Date][] = [
      [amNotification, { amPickerVisible: true }, { borderColor: morningYellow }, amNotificationTime],
      [
        pmNotification,
        { pmPickerVisible: true },
        { borderColor: eveningPurple, marginLeft: 'auto' },
        pmNotificationTime,
      ],
    ]

    const TimePickersTuples: [
      Date,
      TimeKeys,
      boolean,
      Date | undefined, // maxDate
      Date | undefined, // minDate
      object,
      (newTime: Date) => object,
    ][] = [
      [
        amNotificationTime,
        'morning',
        this.state.amPickerVisible,
        new Date('Jan 1 2020 11:59 AM'), // maxDate
        undefined, // no MaxDate
        { amPickerVisible: false },
        newTime => ({ amNotificationTime: newTime }),
      ],
      [
        pmNotificationTime,
        'evening',
        this.state.pmPickerVisible,
        undefined, // no maxDate
        new Date('Jan 1 2020 12:00 PM'), // minDate
        { pmPickerVisible: false },
        newTime => ({ pmNotificationTime: newTime }),
      ],
    ]

    return (
      <>
        {/* Page title bar */}
        <View
          style={{
            borderBottomWidth: 1,
            borderColor: '#fff3',
            borderTopWidth: 1,
            marginVertical: 25,
            paddingVertical: 7,
          }}
        >
          <Text
            style={{
              alignSelf: 'center',
              color: '#fffc',
              fontSize: 11,
              fontWeight: '500',
            }}
          >
            SETTINGS
          </Text>
          <Text style={{ color: '#fff3', fontSize: 11, position: 'absolute', right: 0, top: 7 }}>v{version}</Text>
        </View>

        {/* Time Notification switches */}
        {TimeSwitchesTuples.map(([key, color, isOn, Icon, iconName]) => (
          <TouchableOpacity
            activeOpacity={0.7}
            key={key}
            onPress={() => this.toggleNotification(key)}
            style={{ alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 15 }}
          >
            <View style={{ flexDirection: 'row' }}>
              <Icon
                color={isOn ? color : 'white'}
                name={iconName}
                size={22}
                style={{ paddingLeft: key === 'evening' ? 4 : 0, width: 35 }}
              />
              <Text style={{ color: '#fffc', fontSize: 18 }}>Notification each {key}?</Text>
            </View>
            <Switch
              onValueChange={() => this.toggleNotification(key)}
              style={{
                alignSelf: 'flex-end',
                paddingVertical: 10,
                transform: Platform.OS === 'ios' ? [{ scaleX: 0.8 }, { scaleY: 0.8 }] : [],
              }}
              thumbColor="white"
              trackColor={{ false: 'null', true: color }}
              value={isOn}
            />
          </TouchableOpacity>
        ))}

        {/* AdjustTime buttons */}
        <View
          style={{
            alignItems: 'flex-start',
            flexDirection: 'row',
            marginTop: 10,
            minHeight: 41,
            paddingHorizontal: 40,
          }}
        >
          {AdjustTimeTuples.map(([isOn, onPressState, style, time]) => (
            <React.Fragment key={time.toString()}>
              {isOn && (
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => this.setState(onPressState)}
                  style={[{ borderRadius: 8, borderWidth: 1, paddingHorizontal: 15, paddingVertical: 7 }, style]}
                >
                  <Text style={{ color: '#fffc', fontSize: 18 }}>{dayjs(time).format('h[:]mm a')}</Text>
                </TouchableOpacity>
              )}
            </React.Fragment>
          ))}
        </View>

        {/* TimePickers (invisible until Time button pressed) */}
        {TimePickersTuples.map(([time, key, isVisible, maxDate, minDate, closeState, onConfirm]) => (
          <DateTimePickerModal
            date={time}
            headerTextIOS={`Set ${key} time`}
            isVisible={isVisible}
            key={key}
            maximumDate={maxDate}
            minimumDate={minDate}
            minuteInterval={5}
            mode="time"
            onCancel={() => this.setState(closeState)}
            onConfirm={newTime => {
              this.setState(closeState)
              setState(onConfirm(newTime))
            }}
          />
        ))}

        {/* More Info section */}
        <View style={{ flexDirection: 'row', marginRight: 30, marginTop: 90 }}>
          <Ionicons
            color="#fff8"
            name="ios-information-circle-outline"
            size={24}
            style={{ marginLeft: -2, marginTop: 9, paddingRight: 17 }}
          />
          <View>
            <Text style={{ color: '#fffc', fontSize: 16, lineHeight: 27 }}>
              GoenkaTimer is available for both{'\n'}
              <Link url="https://apps.apple.com/us/app/id1494609891">
                <Ionicons name="logo-apple" size={27} />
                &nbsp; iOS&nbsp;
              </Link>{' '}
              and{' '}
              <Link url="https://play.google.com/store/apps/details?id=com.goenkanative">
                &nbsp;&nbsp;
                <Ionicons name="logo-android" size={27} />
                &nbsp; Android
              </Link>
              .
            </Text>
            <Text style={{ color: '#fffc', fontSize: 16, lineHeight: 27, marginTop: 15 }}>
              For more info about S.N. Goenka or Vipassana meditation, visit{' '}
              <Link url="https://www.dhamma.org">dhamma.org</Link>.
            </Text>
          </View>
        </View>

        {/* Back button */}
        <TouchableOpacity
          onPress={() => setState({ screen: 'InitScreen' })}
          style={{
            alignItems: 'center',
            marginTop: 'auto',
            marginVertical: 10,
            paddingBottom: 50,
            paddingTop: 15,
          }}
        >
          <Text style={{ color: 'white', fontSize: 18, opacity: 0.2 }}>Back</Text>
        </TouchableOpacity>
      </>
    )
  }
}

const Link = ({ url, ...otherProps }: { children: any; url: string }) => (
  <Text
    style={{ color: '#0070c9' }}
    {...otherProps}
    onPress={() => {
      Linking.openURL(url)
    }}
  />
)

export default SettingsScreen
