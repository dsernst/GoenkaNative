import React, { Component } from 'react'
import { Alert, Platform, StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native'
import { Props } from './reducer'
import DateTimePickerModal from 'react-native-modal-datetime-picker'
import dayjs from 'dayjs'
import FeatherIcon from 'react-native-vector-icons/Feather'
import Ionicons from 'react-native-vector-icons/Ionicons'
import PushNotification from 'react-native-push-notification'

type TimeKeys = 'morning' | 'evening'

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
      [amNotification, amNotificationTime],
      [pmNotification, pmNotificationTime],
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
              color: bodyTextColor,
              fontSize: 11,
              fontWeight: '500',
            }}
          >
            SETTINGS
          </Text>
        </View>

        {/* Time Notification switches */}
        {TimeSwitchesTuples.map(([key, color, isOn, Icon, iconName]) => (
          <TouchableOpacity
            activeOpacity={0.7}
            key={key}
            onPress={() => this.toggleNotification(key)}
            style={s.switchRow}
          >
            <Text style={s.text}>
              <Icon color={isOn ? color : 'white'} name={iconName} size={22} />
              {key === 'evening' && ' '}&nbsp; Notification each {key}?
            </Text>
            <Switch
              onValueChange={() => this.toggleNotification(key)}
              style={s.switch}
              thumbColor="white"
              trackColor={{ false: 'null', true: color }}
              value={isOn}
            />
          </TouchableOpacity>
        ))}

        {/* AdjustTime buttons */}
        <View
          style={{
            flexDirection: 'row',
            marginTop: 20,
            paddingHorizontal: 40,
          }}
        >
          {AdjustTimeTuples.map(([isOn, onPressState, style, time]) => (
            <React.Fragment key={time.toString()}>
              {isOn && (
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => this.setState(onPressState)}
                  style={[s.timeBtn, style]}
                >
                  <Text style={s.text}>{dayjs(time).format('h[:]mm a')}</Text>
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
              setState(onConfirm(newTime))
              this.setState(closeState)
            }}
          />
        ))}

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

// Shared vars
const bodyTextColor = '#f1f1f1'

const s = StyleSheet.create({
  switch: {
    alignSelf: 'flex-end',
    paddingVertical: 10,
    transform: Platform.OS === 'ios' ? [{ scaleX: 0.8 }, { scaleY: 0.8 }] : [],
  },
  switchRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 15,
  },
  text: {
    color: bodyTextColor,
    fontSize: 18,
    fontWeight: '400',
    maxWidth: 250,
    opacity: 0.8,
  },
  timeBtn: {
    alignSelf: 'center',
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 15,
    paddingVertical: 7,
  },
})

export default SettingsScreen
