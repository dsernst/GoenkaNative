import React, { Component } from 'react'
import { Text, TextInput, TouchableOpacity } from 'react-native'
import Fontisto from 'react-native-vector-icons/Fontisto'

import BackButton from '../BackButton'
import { Props } from '../reducer'
import TitleBar from '../TitleBar'

class SyncScreen extends Component<Props> {
  state = {
    email: '',
  }

  render() {
    return (
      <>
        <TitleBar name="SYNC" />

        <Text
          style={{
            color: '#fff9',
            fontSize: 18,
            fontWeight: '600',
            marginTop: 14,
          }}
        >
          Backup your sit history
        </Text>

        <Text
          style={{
            color: '#fff9',
            marginTop: 14,
          }}
        >
          What is your e-address?
        </Text>
        <TextInput
          autoCapitalize="none"
          autoCompleteType="email"
          autoCorrect={false}
          autoFocus
          keyboardType="email-address"
          onChangeText={email => this.setState({ email })}
          placeholder="you@email.com"
          placeholderTextColor="#fff5"
          style={{
            backgroundColor: '#353d38',
            borderRadius: 7,
            borderWidth: 0,
            color: '#fffd',
            fontSize: 18,
            marginTop: 15,
            paddingLeft: 15,
            paddingVertical: 10,
          }}
          value={this.state.email}
        />

        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => {}}
          style={{
            alignItems: 'center',
            borderColor: '#fff4',
            borderRadius: 8,
            borderWidth: 1,
            flexDirection: 'row',
            justifyContent: 'center',
            marginTop: 15,
            paddingHorizontal: 15,
            paddingVertical: 7,
          }}
        >
          <Fontisto color="#fffa" name="save" size={16} style={{ paddingLeft: 4, paddingTop: 2, width: 30 }} />
          <Text style={{ color: '#fff9', fontSize: 18, fontWeight: '600' }}>Save</Text>
        </TouchableOpacity>

        <BackButton to="SettingsScreen" />
      </>
    )
  }
}

export default SyncScreen
