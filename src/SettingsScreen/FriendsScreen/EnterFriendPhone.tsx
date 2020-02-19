import React, { useEffect, useRef, useState } from 'react'
import { Text, TextInput, TouchableOpacity } from 'react-native'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'

const EnterFriendPhone = ({}: {}) => {
  const [phone, setPhone] = useState('')
  const [error, setError] = useState()
  const [submitting, setSubmitting] = useState(false)
  useEffect(() => {
    if (!error && !submitting && phone.length === 12 && !phone.includes('+')) {
      submit()
    }
  })

  const textInput = useRef<TextInput>(null)

  return (
    <TouchableOpacity activeOpacity={1} onPress={() => textInput.current?.blur()} style={{ flex: 1 }}>
      <Text style={{ color: '#fff9', marginTop: 15 }}>What is their phone number?</Text>

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
        <MaterialCommunityIcons
          color="#fffa"
          name="account-search"
          size={20}
          style={{ paddingLeft: 4, paddingRight: 8, paddingTop: 2 }}
        />
        <Text style={{ color: '#fff9', fontSize: 18, fontWeight: '600' }}>Lookup</Text>
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
    console.log('called EnterFriendPhone.submit() ', phoneNumber)

    setError(undefined)
    setSubmitting(true)
    try {
      setSubmitting(false)
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
    if (sanitized.length < phone.length) {
      if (sanitized.length === 8 || sanitized.length === 4) {
        if (sanitized[sanitized.length - 1] === ' ') {
          return sanitized.slice(0, -1)
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

export default EnterFriendPhone
