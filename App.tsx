import React, { Component } from 'react'
import { StatusBar, StyleSheet, Text, View } from 'react-native'
import _ from 'lodash'
import InitScreen from './InitScreen'
import CountdownScreen from './CountdownScreen'
import { Sound, clips as c } from './clips'

type State = {
  duration: string
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
    const tryingToPlay = [c.introInstructions, c.closingMetta]
    if (this.state.hasChanting) {
      tryingToPlay.push(c.introChanting, c.closingChanting)
    }
    const durations = tryingToPlay.map(clip => clip.getDuration())
    const totalSecondsNeeded = _.sum(durations) + (this.state.hasChanting ? 7 : 0)
    this.setState({ isEnoughTime: totalSecondsNeeded < Number(this.state.duration) * 60 })
  }

  enqueueOpening() {
    this.setState({ started: true })

    if (this.state.hasChanting) {
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
  }

  enqueueClosing() {
    const closingMettaTime =
      (Number(this.state.duration) * 60 - Math.floor(c.closingMetta.getDuration())) * 1000

    if (this.state.hasChanting) {
      // Begin closingChanting so it ends just before closingMetta starts.
      timeouts.push(
        setTimeout(() => {
          this.setState({ latestTrack: c.closingChanting })
        }, closingMettaTime - (Math.floor(c.closingChanting.getDuration()) + 2) * 1000),
      )
    }

    // Begin closingMetta so it ends when countdown hits zero.
    timeouts.push(
      setTimeout(() => {
        this.setState({ latestTrack: c.closingMetta })
      }, closingMettaTime),
    )
  }

  render() {
    return (
      <>
        <StatusBar barStyle="light-content" />
        <View style={s.app}>
          <Text style={s.title}>Goenka Meditation Timer</Text>
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
                this.setState({ latestTrack: null, started: false })
              }}
            />
          ) : (
            <InitScreen
              {...this.state}
              pressStart={() => {
                this.enqueueOpening()
                this.enqueueClosing()
              }}
              setDuration={(duration: string) => this.setState({ duration })}
              toggle={(key: string) => () => this.setState({ [key]: !this.state[key] })}
            />
          )}
        </View>
      </>
    )
  }
}

// Shared vars
const bodyTextColor = '#f1f1f1'

const s = StyleSheet.create({
  app: {
    backgroundColor: '#001709',
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 18,
  },
  title: {
    alignSelf: 'center',
    color: bodyTextColor,
    fontSize: 24,
    fontWeight: '600',
    marginVertical: 40,
  },
})

export default App
