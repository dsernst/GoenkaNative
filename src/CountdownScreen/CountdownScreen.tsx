import React, { useState } from 'react'
import { StatusBar, TouchableWithoutFeedback, View } from 'react-native'
import KeepAwake from 'react-native-keep-awake'

import BackButton from '../BackButton'
import { Props } from '../reducer'
import BeHappyText from './BeHappyText'
import CountdownCircle from './CountdownCircle'
import pressStop from './press-stop'

function CountdownScreen(props: Props) {
  const { duration, finished, history, setState, toggle } = props
  const [hideStatusBar, setHideStatusBar] = useState(true)

  return (
    <>
      <KeepAwake />
      <StatusBar hidden={hideStatusBar} />
      <TouchableWithoutFeedback onPressIn={() => setHideStatusBar(false)} onPressOut={() => setHideStatusBar(true)}>
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
                const newHistory = [...history]
                newHistory[0].elapsed = elapsed
                setState({ history: newHistory })
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
      <BackButton onPress={() => pressStop(props)} text={finished ? 'Back' : 'Stop'} />
    </>
  )
}

export default CountdownScreen
