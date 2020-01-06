/* eslint-disable react-native/no-inline-styles */
import React from 'react'
import { StyleSheet, Text, TouchableHighlight } from 'react-native'
import CountDown from 'react-native-countdown-component'

// Shared vars
const bodyTextColor = '#f1f1f1'
const btnSize = 80

type CountdownScreenProps = {
  duration: string
  pressStop: () => void
}

const CountdownScreen = ({ duration, pressStop }: CountdownScreenProps) => (
  <>
    <CountDown
      digitStyle={{ backgroundColor: null }}
      digitTxtStyle={{ color: bodyTextColor, marginTop: 10 }}
      separatorStyle={{ color: bodyTextColor, opacity: 0.2 }}
      showSeparator
      size={50}
      style={{ marginTop: 110 }}
      timeLabels={{ m: null, s: null }}
      timeToShow={['M', 'S']}
      until={Number(duration) * 60}
    />
    <TouchableHighlight style={s.stopBtn} onPress={pressStop}>
      <Text style={s.stopText}>Stop</Text>
    </TouchableHighlight>
  </>
)

const s = StyleSheet.create({
  stopBtn: {
    alignItems: 'center',
    alignSelf: 'center',
    borderColor: '#800000',
    borderRadius: btnSize,
    borderWidth: 1,
    height: btnSize,
    justifyContent: 'center',
    marginTop: 60,
    width: btnSize,
  },
  stopText: {
    color: '#eebcbf',
    fontSize: 18,
    fontWeight: '700',
  },
  text: {
    alignSelf: 'center',
    color: bodyTextColor,
    fontSize: 48,
    fontWeight: '400',
    marginTop: 40,
  },
})

export default CountdownScreen
