import React, { Component } from 'react'
import { StatusBar, TouchableWithoutFeedback, View } from 'react-native'
import KeepAwake from 'react-native-keep-awake'

import BackButton from '../BackButton'
import { Props } from '../reducer'
import BeHappyText from './BeHappyText'
import CountdownCircle from './CountdownCircle'
import pressStop from './press-stop'

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
        <BackButton onPress={() => pressStop(this.props)} text={finished ? 'Back' : 'Stop'} />
      </>
    )
  }
}

export default CountdownScreen
