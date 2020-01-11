/* eslint-disable react-native/no-inline-styles */
import React from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import KeepAwake from 'react-native-keep-awake'
import CountdownCircle from './react-native-countdown-circle'

// Shared vars
const bodyTextColor = '#f1f1f1'
const btnSize = 80

type CountdownScreenProps = {
  duration: string
  pressStop: () => void
}

const CountdownScreen = ({ duration, pressStop }: CountdownScreenProps) => (
  <>
    <KeepAwake />
    <View style={{ alignItems: 'center', marginTop: 80 }}>
      <CountdownCircle
        bgColor="#001709"
        borderWidth={4}
        color="#0a2013"
        duration={Number(duration)}
        labelStyle={{ color: bodyTextColor, fontSize: 18, opacity: 0.2 }}
        minutes
        onTimeElapsed={() => console.log('Elapsed!')}
        radius={80}
        shadowColor="#001709"
        textStyle={{ color: bodyTextColor, fontSize: 40 }}
      />
    </View>
    <TouchableOpacity onPress={pressStop} style={s.stopBtn}>
      <Text style={s.stopText}>Stop</Text>
    </TouchableOpacity>
  </>
)

const s = StyleSheet.create({
  stopBtn: {
    alignItems: 'center',
    alignSelf: 'center',
    height: btnSize,
    justifyContent: 'center',
    marginBottom: 30,
    marginTop: 'auto',
    width: btnSize,
  },
  stopText: {
    color: bodyTextColor,
    fontSize: 18,
    fontWeight: '700',
    opacity: 0.2,
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
