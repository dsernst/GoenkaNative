import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth'
import React, { useEffect, useState } from 'react'
import { Text, TextInput, TouchableOpacity, View } from 'react-native'
import Entypo from 'react-native-vector-icons/Entypo'

import { formatPhoneNumber, prettyFormat } from './Friends/phone-helpers'

const EnterPhone = ({
  setConfirmation,
  setUnverifiedPhone,
  unverifiedPhone,
}: {
  setConfirmation: React.Dispatch<FirebaseAuthTypes.ConfirmationResult>
  setUnverifiedPhone: React.Dispatch<string>
  unverifiedPhone: string
}) => {
  const [phone, setPhone] = useState('')
  const [error, setError] = useState()
  const [submitting, setSubmitting] = useState(false)
  useEffect(() => {
    if (!error && !submitting && !unverifiedPhone && phone.length === 12 && !phone.includes('+')) {
      submit()
    }
  })

  return (
    <>
      <Text style={{ color: '#fffb', marginTop: 15 }}>What is your phone number?</Text>

      <View style={{ flexDirection: 'row', marginTop: 10 }}>
        <TextInput
          autoCapitalize="none"
          autoCompleteType="tel"
          autoCorrect={false}
          autoFocus
          keyboardType="phone-pad"
          onChangeText={newVal => {
            setError(undefined)
            setSubmitting(false)
            setPhone(prettyFormat(newVal, phone))
          }}
          placeholder="415 867 5309"
          placeholderTextColor="#fff5"
          style={{
            backgroundColor: '#353d38',
            borderRadius: 7,
            color: '#fffd',
            flex: 1,
            fontSize: 18,
            padding: 10,
          }}
          value={phone}
        />

        <TouchableOpacity
          activeOpacity={0.7}
          onPress={submit}
          style={{
            alignItems: 'center',
            borderColor: '#fff3',
            borderRadius: 5,
            borderWidth: 1,
            flexDirection: 'row',
            justifyContent: 'center',
            marginLeft: 10,
            paddingHorizontal: 13,
          }}
        >
          <Entypo color="#fffa" name="login" size={15} style={{ paddingRight: 12, paddingTop: 1 }} />
          <Text style={{ color: '#fff9', fontSize: 16, fontWeight: '500' }}>Login</Text>
        </TouchableOpacity>
      </View>

      {submitting && (
        <Text
          style={{
            color: '#fff9',
            marginTop: 14,
          }}
        >
          Submitting...
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
    </>
  )

  async function submit() {
    const phoneNumber = formatPhoneNumber(phone)
    console.log('called EnterPhone.submit() ', phoneNumber)

    if (phoneNumber === '+15555555555') {
      auth().settings.appVerificationDisabledForTesting = true
    }

    setError(undefined)
    setSubmitting(true)
    try {
      const confirmation = await auth().signInWithPhoneNumber(phoneNumber)
      setUnverifiedPhone(phoneNumber)
      setSubmitting(false)
      setConfirmation(confirmation)
    } catch (err) {
      setSubmitting(false)
      return setError(err.toString())
    }
  }
}

export default EnterPhone
