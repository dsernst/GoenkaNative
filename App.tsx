import React, { Component } from 'react'
import { StatusBar, StyleSheet, Text, View } from 'react-native'
import InitScreen from './InitScreen'
import CountdownScreen from './CountdownScreen'
import c from './clips'

class App extends Component {
  state = {
    duration: '60',
    hasChanting: false,
    hasExtendedMetta: false,
    started: false,
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
                c.introInstructions.stop()
              }}
            />
          ) : (
            <InitScreen
              {...this.state}
              pressStart={() => {
                this.setState({ started: true })
                c.introInstructions.play()
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
