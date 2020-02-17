import { firebase } from '@react-native-firebase/auth'
import _ from 'lodash'
import React, { useEffect } from 'react'
import { Animated, StatusBar, View, YellowBox } from 'react-native'
import SplashScreen from 'react-native-splash-screen'
import { connect } from 'react-redux'

import c, { SoundWithDelay } from './clips'
import { Props, State, Toggleables, setStatePayload } from './reducer'
import safeAreaHelper from './safe-area-helper'
import screens from './screens'

function App(props: Props) {
  const {
    duration,
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
    SplashScreen.hide() // Wait for JS to load before hiding splash screen
  }, [setState])

  // Init firebase auth
  useEffect(() => {
    const subscriber = firebase.auth().onAuthStateChanged(user => {
      setState({ user })
    })
    return subscriber // unsubscribe on unmount
  }, [setState])

  // Play new track
  useEffect(() => {
    latestTrack?.play()
  }, [latestTrack])

  // If timing settings changed, check if duration is enough
  useEffect(() => {
    // console.log('Checking if duration is enough')
    const queue: SoundWithDelay[] = [c.introInstructions, c.closingMetta]
    if (hasChanting) {
      queue.push(c.introChanting, c.closingChanting)
    }
    if (hasExtendedMetta) {
      queue.push(c.extendedMetta)
    }
    const lengths = queue.map(clip => clip.length)
    // console.log({ duration: duration * 60, lengths, sum: _.sum(lengths) })
    setState({ isEnoughTime: _.sum(lengths) <= duration * 60 })
  }, [duration, hasChanting, hasExtendedMetta, setState])

  const Screen = screens[screen]

  // Suppress Android setTimeout warnings
  // see https://github.com/facebook/react-native/issues/12981
  YellowBox.ignoreWarnings(['Setting a timer for a'])

  return (
    <>
      <StatusBar
        backgroundColor={showHistoryBtnTooltip ? '#000c04' : '#001709'} // Android only
        barStyle="light-content"
        translucent // Android only
      />
      <View
        style={{
          backgroundColor: '#001709',
          flex: 1,
          paddingBottom: safeAreaInsetBottom,
          paddingHorizontal: !['HistoryScreen', 'MultiDeleteScreen'].includes(screen) ? 24 : 8,
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
              marginVertical: 30,
              opacity: titleOpacity,
              paddingBottom: 10,
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
