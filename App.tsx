import React, { Component } from 'react'
import { StatusBar, StyleSheet, Text, View } from 'react-native'
import InitScreen from './InitScreen'
import CountdownScreen from './CountdownScreen'
import { Sound, clips as c } from './clips'

type State = {
  duration: string
  hasChanting: boolean
  hasExtendedMetta: boolean
  latestTrack: Sound | null
  started: boolean
}

class App extends Component {
  state: State = {
    duration: '60',
    hasChanting: false,
    hasExtendedMetta: false,
    latestTrack: null,
    started: false,
  }
  componentDidUpdate(_, prevState: State) {
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
  }
  enqueueClosing() {
    setTimeout(() => {
      this.setState({ latestTrack: c.closingMetta })
    }, (Number(this.state.duration) * 60 - Math.floor(c.closingMetta.getDuration())) * 1000)
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
                this.setState({ started: false })
                if (this.state.latestTrack) {
                  this.state.latestTrack.stop()
                  this.setState({ latestTrack: null })
                }
              }}
            />
          ) : (
            <InitScreen
              {...this.state}
              pressStart={() => {
                this.setState({ latestTrack: c.introInstructions, started: true })
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
