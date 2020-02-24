import firestore from '@react-native-firebase/firestore'
import React, { useState } from 'react'
import { StatusBar, TouchableWithoutFeedback, View } from 'react-native'
import KeepAwake from 'react-native-keep-awake'
import OneSignal from 'react-native-onesignal'

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

  const friendsToNotify = [
    ...acceptedIncomingFriendRequests.map(ifr => ifr.from_onesignal_id),
    ...acceptedOutgoingFriendRequests.map(ofr => ofr.to_onesignal_id),
  ]

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
              onTimeFinished={() => {
                toggle('finished')()
                console.log('...Attempting to autoSync completed sit')
                if (!user) {
                  return console.log('  Not logged in.')
                }

                OneSignal.postNotification(
                  {
                    en: `Your friend ${displayName} just finished a ${duration} minute sit 🙂`,
                  },
                  {},
                  friendsToNotify,
                )

                if (!autoSyncCompletedSits) {
                  return console.log('  AutoSync disabled.')
                }
                setTimeout(async () => {
                  await firestore()
                    .collection('sits')
                    .add({ ...history[0], user_id: user.uid, user_phone: user.phoneNumber })
                  console.log('⬆️  Autosync complete.')
                }, 500)
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
            <BeHappyText />
          )}
        </View>
      </TouchableWithoutFeedback>
      <BackButton onPress={() => pressStop(props)} text={finished ? 'Back' : 'Stop'} />
    </>
  )
}

export default CountdownScreen
