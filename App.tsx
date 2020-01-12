import React, { Component } from 'react'
import { StatusBar, Text, View } from 'react-native'
import _ from 'lodash'
import InitScreen from './InitScreen'
import CountdownScreen from './CountdownScreen'
import { Sound, clips as c } from './clips'

// Shared vars
const bodyTextColor = '#f1f1f1'

type State = {
  duration: string
  finished: boolean
  hasChanting: boolean
  hasExtendedMetta: boolean
  isEnoughTime: boolean
  latestTrack: Sound | null
  started: boolean
}

let timeouts: ReturnType<typeof setTimeout>[] = []

class App extends Component {
  state: State = {
    duration: '60',
    finished: false,
    hasChanting: false,
    hasExtendedMetta: false,
    isEnoughTime: true,
    latestTrack: null,
    started: false,
  }

  componentDidUpdate(_prevProps: any, prevState: State) {
    // New track to play, nothing playing previously
    if (!prevState.latestTrack && this.state.latestTrack) {
      this.state.latestTrack.play()
    }

    // New track to play, another track already playing
    if (
      prevState.latestTrack &&
      this.state.latestTrack &&
      prevState.latestTrack !== this.state.latestTrack
    ) {
      prevState.latestTrack.stop()
      this.state.latestTrack.play()
    }

    // If timing settings changed, check if duration is enough
    if (
      ['duration', 'hasChanting', 'hasExtendedMetta'].some(
        key => prevState[key] !== this.state[key],
      )
    ) {
      this.checkIfDurationIsEnough()
    }
  }

  checkIfDurationIsEnough() {
    const delay = (seconds: number) => ({ getDuration: () => seconds })
    const queue: { getDuration: () => number }[] = [c.introInstructions, c.closingMetta]
    if (this.state.hasChanting) {
      queue.push(c.introChanting, delay(5), c.closingChanting, delay(2))
    }
    if (this.state.hasExtendedMetta) {
      queue.push(c.mettaIntro, delay(3 * 60))
    }
    const durations = queue.map(clip => clip.getDuration())
    this.setState({ isEnoughTime: _.sum(durations) < Number(this.state.duration) * 60 })
  }

  pressStart() {
    this.setState({ started: true })

    if (this.state.hasChanting) {
      // Begin introChanting
      this.setState({ latestTrack: c.introChanting })

      // Setup a timeout to begin introInstructions a few
      // seconds after introChanting finishes.
      timeouts.push(
        setTimeout(() => {
          this.setState({ latestTrack: c.introInstructions })
        }, Math.ceil(c.introChanting.getDuration() + 5) * 1000),
      )
    } else {
      this.setState({ latestTrack: c.introInstructions })
    }

    // Calculate closing time
    const closingMettaTime =
      (Number(this.state.duration) * 60 - Math.floor(c.closingMetta.getDuration())) * 1000

    let extendedMettaTime = closingMettaTime
    if (this.state.hasExtendedMetta) {
      // Begin mettaIntro 3 minutes before closingMetta
      extendedMettaTime -= (Math.floor(c.mettaIntro.getDuration()) + 3 * 60) * 1000

      timeouts.push(
        setTimeout(() => {
          this.setState({ latestTrack: c.mettaIntro })
        }, extendedMettaTime),
      )
    }

    if (this.state.hasChanting) {
      // Begin closingChanting so it ends just before metta starts.
      timeouts.push(
        setTimeout(() => {
          this.setState({ latestTrack: c.closingChanting })
        }, extendedMettaTime - (Math.floor(c.closingChanting.getDuration()) + 2) * 1000),
      )
    }

    // Begin closingMetta so it ends when countdown hits zero.
    timeouts.push(
      setTimeout(() => {
        this.setState({ latestTrack: c.closingMetta })
      }, closingMettaTime),
    )
  }

  toggle(key: string) {
    return () => {
      this.setState({ [key]: !this.state[key] })
    }
  }

  render() {
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
          {this.state.started ? (
            <CountdownScreen
              {...this.state}
              pressStop={() => {
                // Stop any audio
                if (this.state.latestTrack) {
                  this.state.latestTrack.stop()
                }

                // Clear all of the setTimeouts
                let t = timeouts.pop()
                while (t) {
                  clearTimeout(t)
                  t = timeouts.pop()
                }

                // Go back to InitScreen
                this.setState({ finished: false, latestTrack: null, started: false })
              }}
              toggle={this.toggle.bind(this)}
            />
          ) : (
            <InitScreen
              {...this.state}
              pressStart={this.pressStart.bind(this)}
              setDuration={(duration: string) => this.setState({ duration })}
              toggle={this.toggle.bind(this)}
            />
          )}
        </View>
      </>
    )
  }
}

export default App
