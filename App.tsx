import React, { Component } from 'react'
import { ScrollView, StatusBar, StyleSheet, Text } from 'react-native'
import InitScreen from './InitScreen'
import CountdownScreen from './CountdownScreen'
import clips from './clips'

class App extends Component {
  state = { duration: '60', started: false }
  render() {
    return (
      <>
        <StatusBar barStyle="light-content" />
        <ScrollView style={s.scrollView}>
          <Text style={s.title}>Goenka Meditation Timer</Text>
          {this.state.started ? (
            <CountdownScreen {...this.state} pressStop={() => this.setState({ started: false })} />
          ) : (
            <InitScreen
              {...this.state}
              setDuration={(duration: string) => this.setState({ duration })}
              pressStart={() => {
                this.setState({ started: true })
                clips.introInstructions.play()
              }}
            />
          )}
        </ScrollView>
      </>
    )
  }
}

// Shared vars
const bodyTextColor = '#f1f1f1'

const s = StyleSheet.create({
  scrollView: {
    backgroundColor: '#001709',
    paddingHorizontal: 24,
  },
  title: {
    alignSelf: 'center',
    color: bodyTextColor,
    fontSize: 24,
    fontWeight: '600',
    marginTop: 60,
  },
})

export default App
