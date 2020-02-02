import React, { Component } from 'react'
import { Animated, StatusBar, TouchableWithoutFeedback, View } from 'react-native'
import KeepAwake from 'react-native-keep-awake'

import BackButton from '../BackButton'
import { Props } from '../reducer'
import BeHappyText from './BeHappyText'
import CountdownCircle from './CountdownCircle'

class CountdownScreen extends Component<Props> {
  state = {
    hideStatusBar: true,
  }

  render() {
    const { duration, finished, setState, toggle } = this.props
    return (
      <>
        <KeepAwake />
        <StatusBar hidden={this.state.hideStatusBar} />
        <TouchableWithoutFeedback
          onPressIn={() => this.setState({ hideStatusBar: false })}
          onPressOut={() => this.setState({ hideStatusBar: true })}
        >
          <View style={{ alignItems: 'center', marginTop: 80 }}>
            {!finished ? (
              <CountdownCircle
                bgColor="#001709"
                borderWidth={4}
                color="#0a2013"
                duration={duration}
                labelStyle={{ color: '#fff3', fontSize: 18 }}
                minutes
                onTimeFinished={toggle('finished')}
                onTimeInterval={(elapsed: number) => {
                  const history = [...this.props.history]
                  history[0].elapsed = elapsed
                  setState({ history })
                }}
                radius={80}
                shadowColor="#001709"
                textStyle={{ color: '#fffc', fontSize: 40 }}
              />
            ) : (
              <BeHappyText />
            )}
          </View>
        </TouchableWithoutFeedback>
        <BackButton onPress={() => this.pressStop()} text={finished ? 'Back' : 'Stop'} />
      </>
    )
  }

  pressStop() {
    const { history, latestTrack, setState, timeouts, titleOpacity } = this.props

    // Fade in title
    Animated.timing(titleOpacity, {
      toValue: 1,
    }).start()

    // Stop audio
    if (latestTrack) {
      latestTrack.stop()
    }

    // Clear all of the setTimeouts
    const newTimeouts = [...timeouts]
    let t = newTimeouts.pop()
    while (t) {
      clearTimeout(t)
      t = newTimeouts.pop()
    }
    setState({ timeouts: newTimeouts })

    // Go back to InitScreen
    setState({ finished: false, latestTrack: null, screen: 'InitScreen' })

    // Turn on HistoryBtnTooltip if this was their first sit
    if (history.length === 1) {
      setTimeout(() => {
        setState({ showHistoryBtnTooltip: true })
      }, 500)
    }
  }
}

export default CountdownScreen
