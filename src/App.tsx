import React, { Component } from 'react'
import { Animated, StatusBar, View, YellowBox } from 'react-native'
import _ from 'lodash'
import { CountdownScreen, HistoryScreen, InitScreen, SettingsScreen } from './Screens'
import c, { SoundWithDelay } from './clips'
import { connect } from 'react-redux'
import { Props, ScreenNames, State, Toggleables, setStatePayload } from './reducer'
import SplashScreen from 'react-native-splash-screen'

// Shared vars
const bodyTextColor = '#f1f1f1'

const screens: { [screen in ScreenNames]: any } = {
  CountdownScreen,
  HistoryScreen,
  InitScreen,
  SettingsScreen,
}

class App extends Component<Props> {
  componentDidMount() {
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
    const { screen, showHistoryBtnTooltip, titleOpacity } = this.props
    const Screen = screens[screen]

    // Suppress Android setTimeout warnings
    // see https://github.com/facebook/react-native/issues/12981
    YellowBox.ignoreWarnings(['Setting a timer for a'])

    const statusBarColor = showHistoryBtnTooltip ? '#000c04' : '#001709'

    return (
      <>
        <StatusBar backgroundColor={statusBarColor} barStyle="light-content" translucent />
        <View
          style={{
            backgroundColor: '#001709',
            flex: 1,
            paddingHorizontal: screen !== 'HistoryScreen' ? 24 : 8,
            paddingTop: 18,
          }}
        >
          {!['HistoryScreen', 'SettingsScreen'].includes(screen) && (
            <Animated.Text
              style={{
                alignSelf: 'center',
                color: bodyTextColor,
                fontSize: 24,
                fontWeight: '600',
                marginVertical: 40,
                opacity: titleOpacity,
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
