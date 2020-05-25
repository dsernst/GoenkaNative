import dayjs from 'dayjs'
import React, { useEffect, useState } from 'react'
import { Alert, Platform, Switch, Text, TouchableOpacity, View } from 'react-native'
import DateTimePickerModal from 'react-native-modal-datetime-picker'
import PushNotification from 'react-native-push-notification'
import FeatherIcon from 'react-native-vector-icons/Feather'
import Ionicons from 'react-native-vector-icons/Ionicons'

import { Props } from '../reducer'
import setDailyNotifications from './notification'

type TimeKeys = 'morning' | 'evening'

function DailyNotificationSettings(props: Props) {
  const { amNotification, amNotificationTime, history, pmNotification, pmNotificationTime, setState } = props
  const [amPickerVisible, setAmPickerVisible] = useState(false)
  const [pmPickerVisible, setPmPickerVisible] = useState(false)

  // Reset local notifications if settings were adjusted
  useEffect(() => {
    // Clear old notifications
    PushNotification.cancelAllLocalNotifications()

    setDailyNotifications(amNotification, amNotificationTime, pmNotification, pmNotificationTime, history)
  }, [amNotification, pmNotification, amNotificationTime, pmNotificationTime, history])

  async function toggleNotification(key: TimeKeys) {
    // Check iOS notification permissions
    type iosPermission = {
      alert?: boolean
      badge?: boolean
      sound?: boolean
    }
    let permissions: iosPermission = await new Promise(resolve => PushNotification.checkPermissions(resolve))
    if (!permissions.alert) {
      await PushNotification.requestPermissions()
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

  const morningYellow = 'rgb(255, 204, 0)'
  const eveningPurple = 'rgb(175, 82, 222)'

  const TimeSwitchesTuples: [TimeKeys, string, boolean, typeof Ionicons, string][] = [
    ['morning', morningYellow, amNotification, FeatherIcon, 'sun'],
    ['evening', eveningPurple, pmNotification, Ionicons, 'ios-moon'],
  ]

  const AdjustTimeTuples: [boolean, Function, object, Date][] = [
    [amNotification, setAmPickerVisible, { borderColor: morningYellow }, amNotificationTime],
    [pmNotification, setPmPickerVisible, { borderColor: eveningPurple, marginLeft: 'auto' }, pmNotificationTime],
  ]

  const TimePickersTuples: [
    Date,
    TimeKeys,
    boolean,
    Date | undefined, // maxDate
    Date | undefined, // minDate
    Function,
    (newTime: Date) => object,
  ][] = [
    [
      amNotificationTime,
      'morning',
      amPickerVisible,
      new Date('Jan 1 2020 11:59 AM'), // maxDate
      undefined, // no MaxDate
      setAmPickerVisible,
      newTime => ({ amNotificationTime: newTime }),
    ],
    [
      pmNotificationTime,
      'evening',
      pmPickerVisible,
      undefined, // no maxDate
      new Date('Jan 1 2020 12:00 PM'), // minDate
      setPmPickerVisible,
      newTime => ({ pmNotificationTime: newTime }),
    ],
  ]

  return (
    <>
      {/* Time Notification switches */}
      {TimeSwitchesTuples.map(([key, color, isOn, Icon, iconName]) => (
        <TouchableOpacity
          activeOpacity={0.7}
          key={key}
          onPress={() => toggleNotification(key)}
          style={{
            alignItems: 'center',
            flexDirection: 'row',
            justifyContent: 'space-between',
            paddingBottom: 20,
          }}
        >
          <View style={{ flexDirection: 'row' }}>
            <Icon
              color={isOn ? color : 'white'}
              name={iconName}
              size={22}
              style={{ paddingLeft: key === 'evening' ? 4 : 0, width: 35 }}
            />
            <Text style={{ color: '#fffa', fontSize: 16 }}>Notification each {key}?</Text>
          </View>
          <Switch
            onValueChange={() => toggleNotification(key)}
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
          minHeight: 41,
          paddingHorizontal: 34,
        }}
      >
        {AdjustTimeTuples.map(([isOn, setPickerVisible, style, time]) => (
          <React.Fragment key={time.toString()}>
            {isOn && (
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => setPickerVisible(true)}
                style={[{ borderRadius: 8, borderWidth: 1, paddingHorizontal: 15, paddingVertical: 7 }, style]}
              >
                <Text style={{ color: '#fffc', fontSize: 18 }}>{dayjs(time).format('h[:]mm a')}</Text>
              </TouchableOpacity>
            )}
          </React.Fragment>
        ))}
      </View>

      {/* TimePickers (invisible until Time button pressed) */}
      {TimePickersTuples.map(([time, key, isVisible, maxDate, minDate, setPickerVisible, onConfirm]) => (
        <DateTimePickerModal
          date={time}
          headerTextIOS={`Set ${key} time`}
          isVisible={isVisible}
          key={key}
          maximumDate={maxDate}
          minimumDate={minDate}
          minuteInterval={5}
          mode="time"
          onCancel={() => setPickerVisible(false)}
          onConfirm={newTime => {
            setPickerVisible(false)
            setState(onConfirm(newTime))
          }}
        />
      ))}
    </>
  )
}

export default DailyNotificationSettings
