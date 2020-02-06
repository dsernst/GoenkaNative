import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth'
import React, { useEffect, useState } from 'react'
import { Text, TextInput, TouchableOpacity } from 'react-native'
import Fontisto from 'react-native-vector-icons/Fontisto'

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
    if (!error && !submitting && !unverifiedPhone && phone.length === 10 && !phone.includes('+')) {
      submit()
    }
  })

  return (
    <>
      <Text style={{ color: '#fff9', marginTop: 15 }}>What is your phone number?</Text>
      <TextInput
        autoCapitalize="none"
        autoCompleteType="tel"
        autoCorrect={false}
        autoFocus
        keyboardType="phone-pad"
        onChangeText={val => {
          setError(undefined)
          setSubmitting(false)
          if (val.length > 10 && !val.includes('+')) {
            return
          }
          setPhone(val)
        }}
        placeholder="415 867 5309"
        placeholderTextColor="#fff5"
        style={{
          backgroundColor: '#353d38',
          borderRadius: 7,
          color: '#fffd',
          fontSize: 18,
          marginTop: 15,
          paddingVertical: 10,
          textAlign: 'center',
        }}
        value={phone}
      />

      <TouchableOpacity
        activeOpacity={0.7}
        onPress={submit}
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

function formatPhoneNumber(phoneString: string) {
  const numbersOnly = phoneString
    .split('')
    .filter(char => /[0-9]/.test(char)) // Drop non number characters
    .join('')

  if (numbersOnly.length === 10) {
    return '+1' + numbersOnly
  }
  return '+' + numbersOnly
}

export default EnterPhone
