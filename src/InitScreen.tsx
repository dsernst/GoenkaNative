import _ from 'lodash'
import React from 'react'
import {
  Alert,
  Animated,
  Dimensions,
  Easing,
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

import c from './clips'
import { Props } from './reducer'

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

async function pressPlay({ duration, hasChanting, hasExtendedMetta, history, setState, titleOpacity }: Props) {
  // Show instructions if this is their first sit
  if (!history.length) {
    await new Promise(resolve =>
      Alert.alert(
        'First time instructions:',
        `
1) Leave the app open to keep the timer running.

2) Your phone won't auto-lock while the timer is running.

3) Work diligently, work intelligently, work patiently and persistently.

ツ`,
        [{ onPress: resolve, text: 'OK' }],
      ),
    )
  }

  const timeouts = []
  // Switch screens
  setState({ screen: 'CountdownScreen' })

  // Fade out title
  Animated.timing(titleOpacity, {
    duration: 5000,
    easing: Easing.linear,
    toValue: 0.1,
  }).start()

  // Add to history
  setState({
    history: [{ date: new Date(), duration: duration, elapsed: 0, hasChanting, hasExtendedMetta }, ...history],
  })

  if (hasChanting) {
    // Begin introChanting
    setState({ latestTrack: c.introChanting })

    // Setup a timeout to begin introInstructions a few
    // seconds after introChanting finishes.
    timeouts.push(
      setTimeout(() => {
        setState({ latestTrack: c.introInstructions })
      }, c.introChanting.length * 1000),
    )
  } else {
    setState({ latestTrack: c.introInstructions })
  }

  // Calculate closing time
  const closingMettaTime = (duration * 60 - c.closingMetta.length) * 1000

  let extendedMettaTime = closingMettaTime
  if (hasExtendedMetta) {
    // Begin extendedMetta so it ends just before closingMetta
    extendedMettaTime -= c.extendedMetta.length * 1000

    timeouts.push(
      setTimeout(() => {
        setState({ latestTrack: c.extendedMetta.setVolume(1) })
      }, extendedMettaTime),
    )
  }

  if (hasChanting) {
    // Begin closingChanting so it ends just before metta starts.
    timeouts.push(
      setTimeout(() => {
        setState({ latestTrack: c.closingChanting.setVolume(0.7) })
      }, extendedMettaTime - c.closingChanting.length * 1000),
    )
  }

  // Begin closingMetta so it ends when countdown hits zero.
  timeouts.push(
    setTimeout(() => {
      setState({ latestTrack: c.closingMetta.setVolume(0.7) })
    }, closingMettaTime),
  )
  setState({ timeouts })
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
