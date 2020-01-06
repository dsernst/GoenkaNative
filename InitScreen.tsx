import React from 'react'
import { Picker, StyleSheet, Switch, Text, TouchableHighlight, View } from 'react-native'
import _ from 'lodash'

type InitScreenProps = {
  duration: string
  hasIntroChanting: boolean
  hasClosingChanting: boolean
  hasExtendedMetta: boolean
  setDuration: (d: string) => void
  pressStart: () => void
  toggle: (key: string) => (b: boolean) => void
}

function formatDuration(num: string) {
  const totalMinutes = Number(num)
  const hours = Math.floor(totalMinutes / 60)
  const minutes = totalMinutes % 60
  return `${hours ? `${hours} hr ` : ''}${minutes ? `${minutes} min` : ''}`
}

const InitScreen = ({
  duration,
  hasIntroChanting,
  hasClosingChanting,
  hasExtendedMetta,
  pressStart,
  setDuration,
  toggle,
}: InitScreenProps) => (
  <>
    <View style={s.switchRow}>
      <Text style={s.text}>How long would you like to sit?</Text>
    </View>
    <Picker
      selectedValue={duration}
      style={s.durationPicker}
      itemStyle={s.durationItem}
      onValueChange={setDuration}
    >
      {[1, ..._.range(5, 61, 5), ..._.range(90, 301, 15)].map(String).map((num: string) => (
        <Picker.Item label={formatDuration(num)} value={num} key={num} />
      ))}
    </Picker>
    <View style={s.switchRow}>
      <Text style={s.text}>Intro chanting? (2 min)</Text>
      <Switch
        style={s.switch}
        onValueChange={toggle('hasIntroChanting')}
        value={hasIntroChanting}
      />
    </View>
    <View style={s.switchRow}>
      <Text style={s.text}>Closing chanting? (3 min)</Text>
      <Switch
        style={s.switch}
        onValueChange={toggle('hasClosingChanting')}
        value={hasClosingChanting}
      />
    </View>
    <View style={s.switchRow}>
      <Text style={s.text}>Extended mettā? (5 min)</Text>
      <Switch
        style={s.switch}
        onValueChange={toggle('hasExtendedMetta')}
        value={hasExtendedMetta}
      />
    </View>
    <TouchableHighlight style={s.startBtn} onPress={pressStart}>
      <Text style={s.startText}>Start</Text>
    </TouchableHighlight>
  </>
)

// Shared vars
const bodyTextColor = '#f1f1f1'
const btnSize = 80

const s = StyleSheet.create({
  durationItem: {
    color: bodyTextColor,
  },
  durationPicker: {
    backgroundColor: 'hsla(0, 0%, 100%, .05)',
    borderRadius: 10,
    marginTop: 15,
  },
  startBtn: {
    alignItems: 'center',
    alignSelf: 'center',
    borderColor: '#008000',
    borderRadius: btnSize,
    borderWidth: 1,
    height: btnSize,
    justifyContent: 'center',
    marginTop: 30,
    width: btnSize,
  },
  startText: {
    color: '#73d45d',
    fontSize: 18,
    fontWeight: '700',
  },
  switch: {
    alignSelf: 'flex-end',
    transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }],
  },
  switchRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  text: {
    color: bodyTextColor,
    fontSize: 18,
    fontWeight: '400',
    opacity: 0.8,
  },
})

export default InitScreen
