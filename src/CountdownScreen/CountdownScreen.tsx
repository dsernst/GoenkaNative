import PushNotificationIOS from '@react-native-community/push-notification-ios'
import firestore from '@react-native-firebase/firestore'
import React, { useState } from 'react'
import { Alert, Animated, Easing, Platform, StatusBar, Text, TouchableWithoutFeedback, View } from 'react-native'
import KeepAwake from 'react-native-keep-awake'
import OneSignal from 'react-native-onesignal'
import SystemSetting from 'react-native-system-setting'

import BackButton from '../BackButton'
import { Props } from '../reducer'
import BeHappyText from './BeHappyText'
import CircularTimer from './CircularTimer'
import pressStop from './press-stop'

const friendNotifConfirmationOpacity = new Animated.Value(0)

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
  const [friendNotifUnsent, setFriendNotifUnsent] = useState(false)

  const friendsToNotify = [
    ...acceptedIncomingFriendRequests.filter(ifr => ifr.from_wants_notifs).map(ifr => ifr.from_onesignal_id),
    ...acceptedOutgoingFriendRequests.filter(ifr => ifr.to_wants_notifs).map(ofr => ofr.to_onesignal_id),
  ]

  const numFriends = acceptedIncomingFriendRequests.length + acceptedOutgoingFriendRequests.length

  const settingsString = hasExtendedMetta
    ? hasChanting
      ? 'with chanting & extended mettā '
      : 'with extended mettā '
    : hasChanting
    ? 'with chanting '
    : ''

  let airplaneCheckerTimeout: ReturnType<typeof setTimeout>
  async function trySendingFriendNotif() {
    clearTimeout(airplaneCheckerTimeout)

    // Don't show any messages if they don't have any friends to send Notifs to
    if (!numFriends) {
      return setFriendNotifUnsent(false)
    }

    // Check if airplane mode is activated
    const airplaneEnabled = await SystemSetting.isAirplaneEnabled()
    setFriendNotifUnsent(airplaneEnabled)
    if (airplaneEnabled) {
      // Still on? Check again in 1 second
      airplaneCheckerTimeout = setTimeout(() => trySendingFriendNotif(), 1000)
      return console.log('✈️  Airplane Mode still activated')
    }

    // Make sure display name isn't set to 'null'
    if (!displayName) {
      return Alert.alert(
        "Can't send Friend Notification",
        'You need to set a Display Name first. Go to Settings Screen -> Friends section 🙂 ',
      )
    }

    // Send friend notifications
    console.log('👫 Sending friend notif to', numFriends, 'friends')
    setTimeout(() => {
      OneSignal.postNotification(
        {
          en: `Your friend ${displayName} just finished a ${countdownDuration} minute sit ${settingsString}🙂`,
        },
        {},
        friendsToNotify,
      )
    }, 1000) // Run after 1sec delay to ensure we have a connection now

    // Show confirmation, then fade out
    Animated.sequence([
      Animated.timing(friendNotifConfirmationOpacity, { toValue: 0.8 }),
      Animated.delay(2000),
      Animated.timing(friendNotifConfirmationOpacity, {
        duration: 1500,
        easing: Easing.linear,
        toValue: 0,
      }),
    ]).start()
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

                  await trySendingFriendNotif()

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

              {/* DisableAirplaneMode reminder */}
              {friendNotifUnsent && (
                <Text
                  style={{
                    color: '#E58839c7',
                    fontSize: 16,
                    fontStyle: 'italic',
                    fontWeight: '600',
                    lineHeight: 25,
                    textAlign: 'center',
                    top: 160,
                  }}
                >
                  Disable Airplane mode{'\n'}
                  <Text style={{ fontWeight: '300' }}>to send Friend Notification</Text>
                  <KeepAwake />
                </Text>
              )}

              {/* Friend Notif confirmation  */}
              <Animated.Text
                style={{
                  color: '#409887',
                  fontSize: 16,
                  fontStyle: 'italic',
                  fontWeight: '600',
                  opacity: friendNotifConfirmationOpacity,
                  top: 160,
                }}
              >
                Sharing sit with {numFriends} friend{numFriends === 1 ? '' : 's'}
              </Animated.Text>
            </>
          )}
        </View>
      </TouchableWithoutFeedback>
      <BackButton onPress={() => pressStop(props)} text={finished ? 'Back' : 'Stop'} />
    </>
  )
}

export default CountdownScreen
