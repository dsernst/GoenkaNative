import PushNotificationIOS from '@react-native-community/push-notification-ios'
import firestore from '@react-native-firebase/firestore'
import React, { useState } from 'react'
import {
  Alert,
  Animated,
  Platform,
  StatusBar,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native'
import KeepAwake from 'react-native-keep-awake'
import OneSignal from 'react-native-onesignal'
import SystemSetting from 'react-native-system-setting'

import BackButton from '../BackButton'
import { Props } from '../reducer'
import BeHappyText from './BeHappyText'
import CircularTimer from './CircularTimer'
import pressStop from './press-stop'

function CountdownScreen(props: Props) {
  const {
    acceptedIncomingFriendRequests,
    acceptedOutgoingFriendRequests,
    airplaneModeReminderOpacity,
    autoSyncCompletedSits,
    countdownDuration,
    displayName,
    finished,
    hasChanting,
    hasExtendedMetta,
    history,
    setState,
    toggle,
    user,
  } = props
  const [hideStatusBar, setHideStatusBar] = useState(true)
  const [isAirplaneModeOn, setIsAirplaneModeOn] = useState(false)

  const friendsToNotify = [
    ...acceptedIncomingFriendRequests.filter(ifr => ifr.from_wants_notifs).map(ifr => ifr.from_onesignal_id),
    ...acceptedOutgoingFriendRequests.filter(ifr => ifr.to_wants_notifs).map(ofr => ofr.to_onesignal_id),
  ]

  const settingsString = hasExtendedMetta
    ? hasChanting
      ? 'with chanting & extended mettā '
      : 'with extended mettā '
    : hasChanting
    ? 'with chanting '
    : ''

  const sendFriendNotification = () => {
    if (!displayName) {
      return Alert.alert(
        "Can't send Friend Notification",
        'You need to set a Display Name first. Go to Settings Screen -> Friends section 🙂 ',
      )
    }

    OneSignal.postNotification(
      {
        en: `Your friend ${displayName} just finished a ${countdownDuration} minute sit ${settingsString}🙂`,
      },
      {},
      friendsToNotify,
    )
  }

  return (
    <>
      <StatusBar hidden={hideStatusBar} />
      <TouchableWithoutFeedback onPressIn={() => setHideStatusBar(false)} onPressOut={() => setHideStatusBar(true)}>
        <View style={{ alignItems: 'center', marginTop: 80 }}>
          {!finished ? (
            <>
              <KeepAwake />
              <CircularTimer
                bgColor="#001709"
                borderWidth={4}
                color="#0a2013"
                duration={countdownDuration}
                labelStyle={{ color: '#fff3', fontSize: 18 }}
                minutes
                onTimeFinished={async () => {
                  toggle('finished')()
                  console.log('...Attempting to autoSync completed sit')
                  if (!user) {
                    return console.log('  Not logged in.')
                  }

                  // Check if airplane mode is activated
                  const airplaneEnabled = await SystemSetting.isAirplaneEnabled()
                  setIsAirplaneModeOn(airplaneEnabled)
                  if (!airplaneEnabled) {
                    sendFriendNotification()
                  }

                  if (!autoSyncCompletedSits) {
                    return console.log('  AutoSync disabled.')
                  }
                  setTimeout(async () => {
                    await firestore()
                      .collection('sits')
                      .add({ ...history[0], user_id: user.uid, user_phone: user.phoneNumber })
                    console.log('⬆️  Autosync complete.')
                  }, 500)

                  // Clear Notification Center reminders
                  if (Platform.OS === 'ios') {
                    PushNotificationIOS.removeAllDeliveredNotifications()
                  }
                }}
                onTimeInterval={(elapsed: number) => {
                  const newHistory = [...history]
                  newHistory[0].elapsed = elapsed
                  setState({ history: newHistory })
                }}
                radius={80}
                shadowColor="#001709"
                textStyle={{ color: '#fffc', fontSize: 40 }}
              />

              {/* Airplane Mode reminder  */}
              <Animated.Text
                style={{
                  color: '#E58839',
                  fontSize: 18,
                  fontStyle: 'italic',
                  fontWeight: '600',
                  marginTop: 80,
                  opacity: airplaneModeReminderOpacity,
                }}
              >
                Airplane mode reminder
              </Animated.Text>
            </>
          ) : (
            <>
              <BeHappyText />
              {isAirplaneModeOn && (
                <TouchableOpacity
                  onPress={async () => {
                    // Check if airplane mode was switched off
                    const airplaneEnabled = await SystemSetting.isAirplaneEnabled()
                    setIsAirplaneModeOn(airplaneEnabled)
                    if (!airplaneEnabled) {
                      sendFriendNotification()
                    }
                  }}
                  style={{ borderColor: '#fff1', borderRadius: 5, borderWidth: 1, top: 100 }}
                >
                  <Text
                    style={{
                      color: '#E58839a7',
                      fontSize: 15,
                      fontStyle: 'italic',
                      fontWeight: '700',
                      padding: 20,
                      textAlign: 'center',
                    }}
                  >
                    <Text style={{ fontSize: 13, fontWeight: '400' }}>
                      Airplane mode: &nbsp;Can't send Friend Notification
                    </Text>
                    {'\n\n'} Tap to retry
                  </Text>
                  <KeepAwake />
                </TouchableOpacity>
              )}
            </>
          )}
        </View>
      </TouchableWithoutFeedback>
      <BackButton onPress={() => pressStop(props)} text={finished ? 'Back' : 'Stop'} />
    </>
  )
}

export default CountdownScreen
