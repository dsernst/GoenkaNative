import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth'
import React, { useEffect, useRef, useState } from 'react'
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
    if (!error && !submitting && !unverifiedPhone && phone.length === 12 && !phone.includes('+')) {
      submit()
    }
  })

  const textInput = useRef<TextInput>(null)

  return (
    <TouchableOpacity activeOpacity={1} onPress={() => textInput.current?.blur()} style={{ flex: 1 }}>
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
          setPhone(prettyFormat(val))
        }}
        placeholder="415 867 5309"
        placeholderTextColor="#fff5"
        ref={textInput}
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
    </TouchableOpacity>
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

  function prettyFormat(phoneString: string) {
    const sanitized = phoneString
      .split('')
      .filter(char => /[0-9|+| ]/.test(char)) // Only allow numbers, +, and spaces
      .join('')

    // Don't format if they included a '+' (custom country code)
    if (sanitized.includes('+')) {
      return sanitized
    }

    // If they pressed backspace, auto subtract the spaces we added
    // or let them edit normally
    if (phoneString.length < phone.length) {
      if (phone.length === 8 || phone.length === 4) {
        if (phone[phone.length - 1] === ' ') {
          return phoneString.slice(0, -1)
        }
      }
      return sanitized
    }

    // Add a space after their 3rd and 6th number
    if (sanitized.length === 3 || sanitized.length === 7) {
      return sanitized + ' '
    }

    // Don't let them add more than 12 characters
    if (sanitized.length > 12) {
      return phone
    }

    return sanitized
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
