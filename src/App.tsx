import _ from 'lodash'
import React, { useEffect } from 'react'
import { Animated, StatusBar, View, YellowBox } from 'react-native'
import SplashScreen from 'react-native-splash-screen'
import { connect } from 'react-redux'

import c, { SoundPlus } from './clips'
import firebaseHelper from './firebase-helper'
import onesignalHelper from './onesignal-helper'
import { Props, State, Toggleables, setStatePayload } from './reducer'
import safeAreaHelper from './safe-area-helper'
import screens from './screens'

function App(props: Props) {
  const {
    backgroundColor,
    customDuration,
    hasChanting,
    hasExtendedMetta,
    latestTrack,
    safeAreaInsetBottom,
    safeAreaInsetTop,
    screen,
    setState,
    showHistoryBtnTooltip,
    titleOpacity,
  } = props

  // Init
  useEffect(() => {
    // console.log('Init effect')
    safeAreaHelper.init(setState)
    const unsubscribeFromFirebase = firebaseHelper.init(setState)
    const unsubscribeFromOnesignal = onesignalHelper.init(props)
    SplashScreen.hide() // Wait for JS to load before hiding splash screen
    return () => {
      unsubscribeFromFirebase()
      unsubscribeFromOnesignal()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Play new track
  useEffect(() => {
    latestTrack?.setVolume(latestTrack.volume).play()
  }, [latestTrack])

  // If timing settings changed, check if customDuration is enough
  useEffect(() => {
    // console.log('Checking if customDuration is enough')
    const queue: SoundPlus[] = [c.introInstructions, c.closingMetta]
    if (hasChanting) {
      queue.push(c.introChanting, c.closingChanting)
    }
    if (hasExtendedMetta) {
      queue.push(c.extendedMetta)
    }
    const lengths = queue.map(clip => clip.length)
    // console.log({ customDuration: customDuration * 60, lengths, sum: _.sum(lengths) })
    setState({ isEnoughTime: _.sum(lengths) <= customDuration * 60 })
  }, [customDuration, hasChanting, hasExtendedMetta, setState])

  const Screen = screens[screen]

  // Suppress Android setTimeout warnings
  // see https://github.com/facebook/react-native/issues/12981
  YellowBox.ignoreWarnings(['Setting a timer for a'])

  return (
    <>
      <StatusBar
        backgroundColor={showHistoryBtnTooltip ? '#000c04' : backgroundColor} // Android only
        barStyle="light-content"
        translucent // Android only
      />
      <View
        style={{
          backgroundColor,
          flex: 1,
          paddingBottom: safeAreaInsetBottom,
          // @ts-ignore paddingHorizontal is an optional prop, but ts inference misses it
          paddingHorizontal: typeof Screen.paddingHorizontal === 'number' ? Screen.paddingHorizontal : 24,
          paddingTop: safeAreaInsetTop,
        }}
      >
        {['MainScreen', 'CountdownScreen'].includes(screen) && (
          <Animated.Text
            style={{
              alignSelf: 'center',
              color: '#f1f1f1',
              fontSize: 24,
              fontWeight: '600',
              opacity: titleOpacity,
              paddingVertical: 30,
            }}
          >
            Goenka Meditation Timer
          </Animated.Text>
        )}
        <Screen {...props} />
      </View>
    </>
  )
}

export default connect(
  (s: State) => s,

  // Map dispatch into setState prop
  dispatch => ({
    setState: (payload: setStatePayload) => dispatch({ payload, type: 'SET_STATE' }),
    toggle: (key: Toggleables) => () => dispatch({ key, type: 'TOGGLE' }),
  }),
)(App)
