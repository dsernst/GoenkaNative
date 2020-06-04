import _ from 'lodash'
import React from 'react'
import { Picker, Platform, StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native'
import Octicon from 'react-native-vector-icons/Octicons'

import { Props } from '../reducer'

export default (props: Props) => {
  const { customDuration, hasChanting, hasExtendedMetta, setState, toggle } = props

  return (
    <View style={{ paddingHorizontal: 24, paddingTop: 5 }}>
      {/* DurationPicker */}
      <Text style={s.text}>How long would you like to sit?</Text>
      <Picker
        itemStyle={{ color: '#fffc' }}
        onValueChange={(newDuration: number) => setState({ customDuration: newDuration })}
        selectedValue={customDuration}
        style={{
          backgroundColor: 'hsla(0, 0%, 100%, .05)',
          borderRadius: 10,
          color: '#aaa',
          marginBottom: 15,
          marginTop: 15,
        }}
      >
        {[1, 3, ..._.range(5, 61, 5), ..._.range(75, 121, 15)].map((num: number) => (
          <Picker.Item
            key={num}
            label={((n: number) => {
              const hours = Math.floor(n / 60)
              const minutes = n % 60
              return `${hours ? `${hours} hr ` : ''}${minutes ? `${minutes} min` : ''}`
            })(num)}
            value={num}
          />
        ))}
      </Picker>
      {Platform.OS === 'android' && (
        <Octicon
          color="white"
          name="triangle-down"
          size={20}
          style={[{ opacity: 0.3, position: 'absolute', right: 41, top: 56 }]}
        />
      )}

      {/* hasChantingSwitch */}
      <TouchableOpacity activeOpacity={0.7} onPress={toggle('hasChanting')} style={s.switchRow}>
        <Text style={s.text}>Include chanting?</Text>
        <Switch
          onValueChange={toggle('hasChanting')}
          style={s.switch}
          thumbColor="white"
          trackColor={{ false: 'null', true: 'rgb(48, 209, 88)' }}
          value={hasChanting}
        />
      </TouchableOpacity>

      {/* hasExtendedMettaSwitch */}
      <TouchableOpacity activeOpacity={0.7} onPress={toggle('hasExtendedMetta')} style={s.switchRow}>
        <Text style={s.text}>Extended mettā? (4 min)</Text>
        <Switch
          onValueChange={toggle('hasExtendedMetta')}
          style={s.switch}
          thumbColor="white"
          trackColor={{ false: 'null', true: 'rgb(10, 132, 255)' }}
          value={hasExtendedMetta}
        />
      </TouchableOpacity>
    </View>
  )
}

const s = StyleSheet.create({
  switch: {
    alignSelf: 'flex-end',
    paddingVertical: 10,
    transform: Platform.OS === 'ios' ? [{ scaleX: 0.8 }, { scaleY: 0.8 }] : [],
  },
  switchRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  text: {
    color: '#fff9',
    fontSize: 17,
  },
})
