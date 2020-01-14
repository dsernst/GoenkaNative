import React, { Component } from 'react'
import { StatusBar, Text, View } from 'react-native'
import _ from 'lodash'
import InitScreen from './InitScreen'
import CountdownScreen from './CountdownScreen'
import HistoryScreen from './HistoryScreen'
import { clips as c } from './clips'
import { connect } from 'react-redux'
import { ScreenNames, State } from './reducer'

// Shared vars
const bodyTextColor = '#f1f1f1'

const screens: { [screen in ScreenNames]: any } = {
  CountdownScreen,
  HistoryScreen,
  InitScreen,
}

let timeouts: ReturnType<typeof setTimeout>[] = []

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
    const delay = (seconds: number) => ({ getDuration: () => seconds })
    const queue: { getDuration: () => number }[] = [c.introInstructions, c.closingMetta]
    if (hasChanting) {
      queue.push(c.introChanting, delay(5), c.closingChanting, delay(2))
    }
    if (hasExtendedMetta) {
      queue.push(c.mettaIntro, delay(3 * 60))
    }
    const durations = queue.map(clip => clip.getDuration())
    setState({ isEnoughTime: _.sum(durations) < duration * 60 })
  }

  pressStart() {
    const { duration, hasChanting, hasExtendedMetta, history, setState } = this.props

    setState({ screen: 'CountdownScreen' })

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
        }, Math.ceil(c.introChanting.getDuration() + 5) * 1000),
      )
    } else {
      setState({ latestTrack: c.introInstructions })
    }

    // Calculate closing time
    const closingMettaTime = (duration * 60 - Math.floor(c.closingMetta.getDuration())) * 1000

    let extendedMettaTime = closingMettaTime
    if (hasExtendedMetta) {
      // Begin mettaIntro 3 minutes before closingMetta
      extendedMettaTime -= (Math.floor(c.mettaIntro.getDuration()) + 3 * 60) * 1000

      timeouts.push(
        setTimeout(() => {
          setState({ latestTrack: c.mettaIntro })
        }, extendedMettaTime),
      )
    }

    if (hasChanting) {
      // Begin closingChanting so it ends just before metta starts.
      timeouts.push(
        setTimeout(() => {
          setState({ latestTrack: c.closingChanting })
        }, extendedMettaTime - (Math.floor(c.closingChanting.getDuration()) + 2) * 1000),
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
    const { latestTrack, setState } = this.props

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
    const { screen, setState } = this.props
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
            <Text
              style={{
                alignSelf: 'center',
                color: bodyTextColor,
                fontSize: 24,
                fontWeight: '600',
                marginVertical: 40,
              }}
            >
              Goenka Meditation Timer
            </Text>
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
