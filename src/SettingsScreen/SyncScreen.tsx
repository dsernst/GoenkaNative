import React, { Component } from 'react'
import { Text, TextInput } from 'react-native'

import BackButton from '../BackButton'
import { Props } from '../reducer'
import TitleBar from '../TitleBar'

// import Octicons from 'react-native-vector-icons/Octicons'

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

        <BackButton to="SettingsScreen" />
      </>
    )
  }
}

export default SyncScreen
