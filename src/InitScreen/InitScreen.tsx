import _ from 'lodash'
import React from 'react'
import {
  Alert,
  Dimensions,
  Picker,
  Platform,
  StatusBar,
  StyleSheet,
  Switch,
  Text,
  TouchableHighlight,
  TouchableOpacity,
  View,
} from 'react-native'
import AntIcon from 'react-native-vector-icons/AntDesign'
import Octicon from 'react-native-vector-icons/Octicons'
import Tooltip from 'react-native-walkthrough-tooltip'

import { Props } from '../reducer'
import pressPlay from './press-play'

const { width: screenWidth } = Dimensions.get('window')

const InitScreen = (props: Props) => {
  const { duration, hasChanting, hasExtendedMetta, isEnoughTime, setState, showHistoryBtnTooltip, toggle } = props
  return (
    <>
      {/* DurationPicker */}
      <Text style={s.text}>How long would you like to sit?</Text>
      <Picker
        itemStyle={{ color: '#fffc' }}
        onValueChange={(newDuration: number) => setState({ duration: newDuration })}
        selectedValue={duration}
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
          style={[{ opacity: 0.3, position: 'absolute', right: 41, top: 187 }]}
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

      {/* Bottom row */}
      <View
        style={{
          alignItems: 'center',
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginBottom: 30,
          marginTop: 'auto',
        }}
      >
        {/* spacer */}
        <TouchableOpacity
          onPress={() => setState({ screen: 'SettingsScreen' })}
          style={{ padding: 15, paddingLeft: 0, width: 50 }}
        >
          <AntIcon color="#fff3" name="setting" size={30} />
        </TouchableOpacity>

        {/* StartBtn */}
        <TouchableHighlight
          onPress={
            isEnoughTime
              ? pressPlay.bind(null, props)
              : () => {
                  Alert.alert('Not enough time', 'Lengthen the duration, or turn off the optional extras.')
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

        {/* HistoryBtn */}
        <Tooltip
          childContentSpacing={0}
          content={<Text style={{ fontWeight: '500' }}>Your history</Text>}
          contentStyle={{ backgroundColor: '#ccc', left: screenWidth / 2 - 78 }}
          isVisible={showHistoryBtnTooltip}
          onClose={toggle('showHistoryBtnTooltip')}
          placement="top"
          topAdjustment={Platform.OS === 'android' ? -StatusBar.currentHeight! : 0}
        >
          <TouchableOpacity
            onPress={() => setState({ screen: 'HistoryScreen' })}
            style={{ padding: 15, paddingRight: 0, width: 50 }}
          >
            <Octicon color="#fffd" name="calendar" size={30} style={{ opacity: showHistoryBtnTooltip ? 0.6 : 0.2 }} />
          </TouchableOpacity>
        </Tooltip>
      </View>
    </>
  )
}

const btnSize = 80

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
    paddingVertical: 15,
  },
  text: {
    color: '#fff9',
    fontSize: 18,
    fontWeight: '400',
  },
})

export default InitScreen
