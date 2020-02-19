import { FirebaseAuthTypes } from '@react-native-firebase/auth'
import firestore from '@react-native-firebase/firestore'
import React, { Ref, useState } from 'react'
import { Text, TextInput, TouchableOpacity } from 'react-native'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'

import SendRequestButton from './SendRequestButton'

const EnterFriendPhone = ({ textInput, user }: { textInput: Ref<TextInput>; user: FirebaseAuthTypes.User }) => {
  const [phone, setPhone] = useState('')
  const [error, setError] = useState()
  const [submitting, setSubmitting] = useState(false)
  const [potentialFriend, setPotentialFriend] = useState()

  return (
    <>
      <Text style={{ color: '#fff9', marginTop: 15 }}>What is their phone number?</Text>

      <TextInput
        autoCapitalize="none"
        autoCompleteType="tel"
        autoCorrect={false}
        keyboardType="phone-pad"
        onChangeText={val => {
          setError(undefined)
          setSubmitting(false)
          setPotentialFriend(undefined)
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
        disabled={!!potentialFriend}
        onPress={submit}
        style={{
          alignItems: 'center',
          borderColor: '#fff4',
          borderRadius: 8,
          borderWidth: 1,
          flexDirection: 'row',
          justifyContent: 'center',
          marginTop: 15,
          opacity: potentialFriend ? 0.7 : 1,
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
          Searching...
        </Text>
      )}

      {error && (
        <Text
          style={{
            color: '#ff5e5e',
            marginTop: 14,
          }}
        >
          {error}
        </Text>
      )}

      {potentialFriend && <SendRequestButton potentialFriend={potentialFriend} user={user} />}
    </>
  )

  async function submit() {
    const phoneNumber = formatPhoneNumber(phone)
    // console.log('called EnterFriendPhone.submit() ', phoneNumber)
    let foundUser

    setError(undefined)
    setSubmitting(true)
    setPotentialFriend(undefined)
    try {
      foundUser = (
        await firestore()
          .collection('users')
          .where('phone', '==', phoneNumber)
          .get()
      ).docs.map(doc => ({ id: doc.id, ...doc.data() }))[0]
    } catch (err) {
      return setError(err.toString())
    }
    setSubmitting(false)

    if (!foundUser) {
      return setError(
        "Can't find a user record for that number.\n\nAre you sure it's correct?\n\nMaybe they need to backup first?",
      )
    }

    setPotentialFriend(foundUser)
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

export default EnterFriendPhone
