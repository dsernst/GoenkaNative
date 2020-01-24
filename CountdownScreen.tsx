import React, { Component } from 'react'
import {
  Animated,
  StatusBar,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native'
import KeepAwake from 'react-native-keep-awake'
import CountdownCircle from './react-native-countdown-circle'
import BeHappyText from './BeHappyText'
import { Props } from './reducer'

// Shared vars
const bodyTextColor = '#f1f1f1'
const btnSize = 80

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
                labelStyle={{ color: bodyTextColor, fontSize: 18, opacity: 0.2 }}
                minutes
                onTimeFinished={toggle('finished')}
                onTimeInterval={(elapsed: number) => {
                  const history = [...this.props.history]
                  history[0].elapsed = elapsed
                  setState({ history })
                }}
                radius={80}
                shadowColor="#001709"
                textStyle={{ color: bodyTextColor, fontSize: 40 }}
              />
            ) : (
              <BeHappyText />
            )}
          </View>
        </TouchableWithoutFeedback>
        <TouchableOpacity
          onPress={() => this.pressStop()}
          style={{
            alignItems: 'center',
            alignSelf: 'center',
            height: btnSize,
            justifyContent: 'center',
            marginBottom: 30,
            marginTop: 'auto',
            width: btnSize,
          }}
        >
          <Text
            style={{
              color: bodyTextColor,
              fontSize: 18,
              opacity: 0.2,
            }}
          >
            {finished ? 'Back' : 'Stop'}
          </Text>
        </TouchableOpacity>
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
      setState({ showHistoryBtnTooltip: true })
    }
  }
}

export default CountdownScreen
