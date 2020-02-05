import auth from '@react-native-firebase/auth'
import React, { useState } from 'react'
import { Text, TextInput, TouchableOpacity } from 'react-native'
import Fontisto from 'react-native-vector-icons/Fontisto'

import BackButton from '../BackButton'
import TitleBar from '../TitleBar'

const SyncScreen = () => {
  const [email, setEmail] = useState('')
  const [error, setError] = useState()
  const [sentEmail, setSentEmail] = useState(false)

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
        onChangeText={val => {
          setError(undefined)
          setSentEmail(false)
          setEmail(val)
        }}
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
        value={email}
      />

      <TouchableOpacity
        activeOpacity={0.7}
        disabled={sentEmail}
        onPress={async () => {
          try {
            await auth().sendSignInLinkToEmail(email, {
              handleCodeInApp: true,
              url: 'https://goenka.app/email-verification',
            })
          } catch (err) {
            console.log(err.toString())
            return setError(err.toString())
          }
          setSentEmail(true)
        }}
        style={{
          alignItems: 'center',
          borderColor: '#fff4',
          borderRadius: 8,
          borderWidth: 1,
          flexDirection: 'row',
          justifyContent: 'center',
          marginTop: 15,
          opacity: sentEmail ? 0.4 : 1,
          paddingHorizontal: 15,
          paddingVertical: 7,
        }}
      >
        <Fontisto color="#fffa" name="save" size={16} style={{ paddingLeft: 4, paddingTop: 2, width: 30 }} />
        <Text style={{ color: '#fff9', fontSize: 18, fontWeight: '600' }}>Save</Text>
      </TouchableOpacity>

      {sentEmail && (
        <Text
          style={{
            color: '#fff9',
            marginTop: 24,
          }}
        >
          Sent confirmation link, check your email.
        </Text>
      )}

      {error && (
        <Text
          style={{
            color: '#f00d',
            marginTop: 14,
          }}
        >
          {error}
        </Text>
      )}

      <BackButton to="SettingsScreen" />
    </>
  )
}

export default SyncScreen
