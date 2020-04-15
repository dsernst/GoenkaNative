import PushNotificationIOS from '@react-native-community/push-notification-ios'
import firestore from '@react-native-firebase/firestore'
import React, { useState } from 'react'
import { Platform, StatusBar, Text, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native'
import KeepAwake from 'react-native-keep-awake'
import OneSignal from 'react-native-onesignal'
import SystemSetting from 'react-native-system-setting'

import BackButton from '../BackButton'
import { Props } from '../reducer'
import BeHappyText from './BeHappyText'
import CountdownCircle from './CountdownCircle'
import pressStop from './press-stop'

function CountdownScreen(props: Props) {
  const {
    acceptedIncomingFriendRequests,
    acceptedOutgoingFriendRequests,
    autoSyncCompletedSits,
    displayName,
    duration,
    finished,
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

  const sendFriendNotification = () =>
    OneSignal.postNotification(
      {
        en: `Your friend ${displayName} just finished a ${duration} minute sit 🙂`,
      },
      {},
      friendsToNotify,
    )

  return (
    <>
      <KeepAwake />
      <StatusBar hidden={hideStatusBar} />
      <TouchableWithoutFeedback onPressIn={() => setHideStatusBar(false)} onPressOut={() => setHideStatusBar(true)}>
        <View style={{ alignItems: 'center', marginTop: 80 }}>
          {!finished ? (
            <CountdownCircle
              bgColor="#001709"
              borderWidth={4}
              color="#0a2013"
              duration={duration}
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
                  style={{ borderColor: '#fff1', borderRadius: 4, borderWidth: 1, top: 100 }}
                >
                  <Text style={{ color: '#E5883977', fontStyle: 'italic', padding: 20, textAlign: 'center' }}>
                    <Text style={{ fontSize: 18, fontWeight: '600' }}>
                      Airplane mode: {isAirplaneModeOn ? 'on' : 'off'}
                    </Text>
                    {'\n'} Tap to retry sending Friend Notification
                  </Text>
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
