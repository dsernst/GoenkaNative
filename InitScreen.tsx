import React from 'react'
import {
  Alert,
  Picker,
  StyleSheet,
  Switch,
  Text,
  TouchableHighlight,
  TouchableOpacity,
  View,
} from 'react-native'
import _ from 'lodash'
import Icon from 'react-native-vector-icons/Octicons'

type InitScreenProps = {
  duration: number
  hasChanting: boolean
  hasExtendedMetta: boolean
  isEnoughTime: boolean
  openHistory: () => void
  pressStart: () => void
  setDuration: (d: string) => void
  toggle: (key: string) => () => void
}

const InitScreen = ({
  duration,
  hasChanting,
  hasExtendedMetta,
  isEnoughTime,
  openHistory,
  pressStart,
  setDuration,
  toggle,
}: InitScreenProps) => (
  <>
    <Text style={s.text}>How long would you like to sit?</Text>
    <Picker
      itemStyle={{ color: bodyTextColor }}
      onValueChange={setDuration}
      selectedValue={duration}
      style={{
        backgroundColor: 'hsla(0, 0%, 100%, .05)',
        borderRadius: 10,
        marginBottom: 15,
        marginTop: 15,
      }}
    >
      {[1, 3, ..._.range(5, 61, 5), ..._.range(75, 181, 15), ..._.range(210, 301, 30)].map(
        (num: number) => (
          <Picker.Item
            key={num}
            label={((n: number) => {
              const hours = Math.floor(n / 60)
              const minutes = n % 60
              return `${hours ? `${hours} hr ` : ''}${minutes ? `${minutes} min` : ''}`
            })(num)}
            value={num}
          />
        ),
      )}
    </Picker>
    <TouchableOpacity activeOpacity={0.7} onPress={toggle('hasChanting')} style={s.switchRow}>
      <Text style={s.text}>Include chanting?</Text>
      <Switch onValueChange={toggle('hasChanting')} style={s.switch} value={hasChanting} />
    </TouchableOpacity>
    <TouchableOpacity activeOpacity={0.7} onPress={toggle('hasExtendedMetta')} style={s.switchRow}>
      <Text style={s.text}>Extended mettā? (4 min)</Text>
      <Switch
        onValueChange={toggle('hasExtendedMetta')}
        style={s.switch}
        trackColor={{ false: 'null', true: 'rgb(10, 132, 255)' }}
        value={hasExtendedMetta}
      />
    </TouchableOpacity>
    <View
      style={{
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 30,
        marginTop: 'auto',
        paddingHorizontal: 0,
      }}
    >
      <View style={{ width: 47 }} />
      <TouchableHighlight
        onPress={
          isEnoughTime
            ? pressStart
            : () => {
                Alert.alert(
                  'Not enough time',
                  'Lengthen the duration, or turn off the optional extras.',
                )
              }
        }
        style={{
          alignItems: 'center',
          borderColor: '#008000',
          borderRadius: btnSize,
          borderWidth: 1,
          height: btnSize,
          justifyContent: 'center',
          opacity: isEnoughTime ? 1 : 0.3,
          width: btnSize,
        }}
      >
        <Text
          style={{
            color: '#73d45d',
            fontSize: 18,
            fontWeight: '500',
          }}
        >
          Start
        </Text>
      </TouchableHighlight>
      <TouchableOpacity onPress={openHistory} style={{ padding: 15, paddingRight: 8, width: 47 }}>
        <Icon color={bodyTextColor} name="calendar" size={30} style={{ opacity: 0.2 }} />
      </TouchableOpacity>
    </View>
  </>
)

// Shared vars
const bodyTextColor = '#f1f1f1'
const btnSize = 80

const s = StyleSheet.create({
  switch: {
    alignSelf: 'flex-end',
    paddingVertical: 10,
    transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }],
  },
  switchRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 15,
  },
  text: {
    color: bodyTextColor,
    fontSize: 18,
    fontWeight: '400',
    opacity: 0.8,
  },
})

export default InitScreen
