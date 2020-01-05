import React, { Component } from 'react'
import {
  Alert,
  Picker,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableHighlight,
} from 'react-native'
import _ from 'lodash'

class App extends Component {
  state = { duration: '60' }
  render() {
    return (
      <>
        <StatusBar barStyle="light-content" />
        <ScrollView style={s.scrollView}>
          <Text style={s.title}>S.N Goenka Meditation Timer</Text>
          <Text style={s.text}>How long would you like to sit?</Text>
          <Picker
            selectedValue={this.state.duration}
            style={s.durationPicker}
            itemStyle={s.durationItem}
            onValueChange={itemValue => this.setState({ duration: itemValue })}
          >
            {_.range(1, 301)
              .map(String)
              .map((num: string) => (
                <Picker.Item label={`${num} min`} value={num} key={num} />
              ))}
          </Picker>
          <TouchableHighlight
            style={s.startBtn}
            onPress={() =>
              Alert.alert(`Starting ${this.state.duration} min meditation`)
            }
          >
            <Text style={s.startText}>Start</Text>
          </TouchableHighlight>
        </ScrollView>
      </>
    )
  }
}

// Shared vars
const bodyTextColor = '#f2f2f2'
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
  scrollView: {
    backgroundColor: '#001709',
    paddingHorizontal: 24,
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
  title: {
    alignSelf: 'center',
    color: bodyTextColor,
    fontSize: 24,
    fontWeight: '600',
    marginTop: 40,
  },
})

export default App
