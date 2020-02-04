import _ from 'lodash'
import React, { Component } from 'react'
import { Animated, StatusBar, View, YellowBox } from 'react-native'
import SplashScreen from 'react-native-splash-screen'
import { connect } from 'react-redux'

import c, { SoundWithDelay } from './clips'
import { Props, State, Toggleables, setStatePayload } from './reducer'
import safeAreaHelper from './safe-area-helper'
import screens from './screens'

class App extends Component<Props> {
  componentDidMount() {
    safeAreaHelper.init(this.props.setState)
    SplashScreen.hide() // Wait for JS to load before hiding green splash screen
  }

  componentDidUpdate(prevProps: Props) {
    const { latestTrack } = this.props
    // New track to play, nothing playing previously
    if (latestTrack && !prevProps.latestTrack) {
      latestTrack.play()
    }

    // New track to play, another track already playing
    if (latestTrack && prevProps.latestTrack && prevProps.latestTrack !== latestTrack) {
      prevProps.latestTrack.stop()
      latestTrack.play()
    }

    // If timing settings changed, check if duration is enough
    if (
      prevProps.duration !== this.props.duration ||
      prevProps.hasChanting !== this.props.hasChanting ||
      prevProps.hasExtendedMetta !== this.props.hasExtendedMetta
    ) {
      this.checkIfDurationIsEnough()
    }
  }

  checkIfDurationIsEnough() {
    const { duration, hasChanting, hasExtendedMetta, setState } = this.props
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
  }

  render() {
    const { safeAreaInsetBottom, safeAreaInsetTop, screen, showHistoryBtnTooltip, titleOpacity } = this.props
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
            paddingHorizontal: screen !== 'HistoryScreen' ? 24 : 8,
            paddingTop: safeAreaInsetTop,
          }}
        >
          {!['HistoryScreen', 'SettingsScreen'].includes(screen) && (
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
          <Screen {...this.props} />
        </View>
      </>
    )
  }
}

export default connect(
  (s: State) => s,

  // Map dispatch into setState prop
  dispatch => ({
    setState: (payload: setStatePayload) => dispatch({ payload, type: 'SET_STATE' }),
    toggle: (key: Toggleables) => () => dispatch({ key, type: 'TOGGLE' }),
  }),
)(App)
