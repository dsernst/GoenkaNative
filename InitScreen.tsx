import React, { Component } from 'react'
import { Picker, StyleSheet, Text, TouchableHighlight } from 'react-native'
import _ from 'lodash'

class InitScreen extends Component {
  render() {
    return (
      <>
        <Text style={s.text}>How long would you like to sit?</Text>
        <Picker
          selectedValue={this.props.duration}
          style={s.durationPicker}
          itemStyle={s.durationItem}
          onValueChange={itemValue => this.props.setDuration(itemValue)}
        >
          {_.range(1, 301)
            .map(String)
            .map((num: string) => (
              <Picker.Item label={`${num} min`} value={num} key={num} />
            ))}
        </Picker>
        <TouchableHighlight style={s.startBtn} onPress={this.props.pressStart}>
          <Text style={s.startText}>Start</Text>
        </TouchableHighlight>
      </>
    )
  }
}

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
    marginTop: 60,
    width: btnSize,
  },
  startText: {
    color: '#73d45d',
    fontSize: 18,
    fontWeight: '700',
  },
  text: {
    color: bodyTextColor,
    fontSize: 18,
    fontWeight: '400',
    marginTop: 40,
  },
})

export default InitScreen
