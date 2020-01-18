import React, { Component } from 'react'
import { StatusBar, Text, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native'
import KeepAwake from 'react-native-keep-awake'
import CountdownCircle from './react-native-countdown-circle'
import BeHappyText from './BeHappyText'

// Shared vars
const bodyTextColor = '#f1f1f1'
const btnSize = 80

type CountdownScreenProps = {
  duration: number
  finished: boolean
  pressStop: () => void
  toggle: (key: string) => () => void
  updateElapsed: (elapsed?: number) => void
}

class CountdownScreen extends Component<CountdownScreenProps> {
  state = {
    hideStatusBar: true,
  }

  render() {
    const { duration, finished, pressStop, toggle, updateElapsed } = this.props
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
                onTimeInterval={updateElapsed}
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
          onPress={pressStop}
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
}

export default CountdownScreen
