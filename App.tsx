import React, { Component } from 'react'
import { Animated, Easing, StatusBar, View } from 'react-native'
import _ from 'lodash'
import InitScreen from './InitScreen'
import CountdownScreen from './CountdownScreen'
import HistoryScreen from './HistoryScreen'
import c, { SoundWithDelay } from './clips'
import { connect } from 'react-redux'
import { ScreenNames, State } from './reducer'

// Shared vars
const bodyTextColor = '#f1f1f1'

const screens: { [screen in ScreenNames]: any } = {
  CountdownScreen,
  HistoryScreen,
  InitScreen,
}

const timeouts: ReturnType<typeof setTimeout>[] = []

interface Props extends State {
  setState: (payload: object) => void
}

class App extends Component<Props> {
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
    setState({ isEnoughTime: _.sum(lengths) < duration * 60 })
  }

  pressStart() {
    const { duration, hasChanting, hasExtendedMetta, history, setState, titleOpacity } = this.props

    // Switch screens
    setState({ screen: 'CountdownScreen' })

    // Fade out title
    Animated.timing(titleOpacity, {
      duration: 5000,
      easing: Easing.linear,
      toValue: 0.1,
    }).start()

    // Add to history
    setState({ history: [{ date: new Date(), duration: duration, elapsed: 0 }, ...history] })

    if (hasChanting) {
      // Begin introChanting
      setState({ latestTrack: c.introChanting })

      // Setup a timeout to begin introInstructions a few
      // seconds after introChanting finishes.
      timeouts.push(
        setTimeout(() => {
          setState({ latestTrack: c.introInstructions })
        }, c.introChanting.length * 1000),
      )
    } else {
      setState({ latestTrack: c.introInstructions })
    }

    // Calculate closing time
    const closingMettaTime = (duration * 60 - c.closingMetta.length) * 1000

    let extendedMettaTime = closingMettaTime
    if (hasExtendedMetta) {
      // Begin extendedMetta so it ends just before closingMetta
      extendedMettaTime -= c.extendedMetta.length * 1000

      timeouts.push(
        setTimeout(() => {
          setState({ latestTrack: c.extendedMetta })
        }, extendedMettaTime),
      )
    }

    if (hasChanting) {
      // Begin closingChanting so it ends just before metta starts.
      timeouts.push(
        setTimeout(() => {
          setState({ latestTrack: c.closingChanting })
        }, extendedMettaTime - c.closingChanting.length * 1000),
      )
    }

    // Begin closingMetta so it ends when countdown hits zero.
    timeouts.push(
      setTimeout(() => {
        setState({ latestTrack: c.closingMetta })
      }, closingMettaTime),
    )
  }

  pressStop() {
    const { latestTrack, setState, titleOpacity } = this.props

    // Fade in title
    Animated.timing(titleOpacity, {
      toValue: 1,
    }).start()

    // Stop audio
    if (latestTrack) {
      latestTrack.stop()
    }

    // Clear all of the setTimeouts
    let t = timeouts.pop()
    while (t) {
      clearTimeout(t)
      t = timeouts.pop()
    }

    // Go back to InitScreen
    setState({ finished: false, latestTrack: null, screen: 'InitScreen' })
  }

  render() {
    const { screen, setState, titleOpacity } = this.props
    const Screen = screens[screen]

    return (
      <>
        <StatusBar barStyle="light-content" />
        <View
          style={{
            backgroundColor: '#001709',
            flex: 1,
            paddingHorizontal: 24,
            paddingTop: 18,
          }}
        >
          {screen !== 'HistoryScreen' && (
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
          <Screen
            {...this.props}
            openHistory={() => setState({ screen: 'HistoryScreen' })}
            pressStart={this.pressStart.bind(this)}
            pressStop={this.pressStop.bind(this)}
            removeSit={(index: number) => () => {
              const history = [...this.props.history]
              history.splice(index, 1)
              setState({ history })
            }}
            setDuration={(duration: number) => setState({ duration })}
            toggle={(key: string) => () =>
              setState({ [key]: !_.pickBy(this.props, _.isBoolean)[key] })}
            updateElapsed={(elapsed: number) => {
              const history = [...this.props.history]
              history[0].elapsed = elapsed
              setState({ history })
            }}
          />
        </View>
      </>
    )
  }
}

export default connect(
  (s: State) => s,
  dispatch => ({
    setState: (payload: object) => {
      dispatch({ payload, type: 'setState' })
    },
  }),
)(App)
