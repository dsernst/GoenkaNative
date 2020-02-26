import firestore from '@react-native-firebase/firestore'
import React, { useRef, useState } from 'react'
import { Text, TextInput, TouchableOpacity, View } from 'react-native'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'

import { Props } from '../../reducer'
import { formatPhoneNumber, prettyFormat } from './phone-helpers'
import SendRequestButton from './SendRequestButton'

const EnterFriendPhone = (props: Props) => {
  const { outgoingFriendRequests, user } = props
  const [phone, setPhone] = useState('')
  const [error, setError] = useState()
  const [submitting, setSubmitting] = useState(false)
  const [potentialFriend, setPotentialFriend] = useState()
  const textInput = useRef<TextInput>(null)

  return (
    <View style={{ marginHorizontal: 15 }}>
      <Text
        style={{
          color: '#fff9',
          fontSize: 14,
        }}
      >
        Or add a friend by phone number:
      </Text>

      <View style={{ flexDirection: 'row', marginTop: 10 }}>
        <TextInput
          autoCapitalize="none"
          autoCompleteType="tel"
          autoCorrect={false}
          keyboardType="phone-pad"
          onChangeText={newVal => {
            setError(undefined)
            setSubmitting(false)
            setPotentialFriend(undefined)
            setPhone(prettyFormat(newVal, phone))
          }}
          placeholder="415 867 5309"
          placeholderTextColor="#fff5"
          ref={textInput}
          style={{
            backgroundColor: '#353d38',
            borderRadius: 5,
            color: '#fffd',
            flex: 1,
            fontSize: 18,
            paddingLeft: 10,
            paddingVertical: 7,
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
            borderRadius: 5,
            borderWidth: 1,
            flexDirection: 'row',
            justifyContent: 'center',
            marginLeft: 10,
            opacity: potentialFriend ? 0.7 : 1,
            paddingHorizontal: 10,
          }}
        >
          <MaterialCommunityIcons
            color="#fffa"
            name="account-search"
            size={20}
            style={{ paddingLeft: 2, paddingRight: 8, paddingTop: 2 }}
          />
          <Text style={{ color: '#fff9', fontSize: 17, fontWeight: '500' }}>Lookup</Text>
        </TouchableOpacity>
      </View>

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

      {potentialFriend && (
        <SendRequestButton
          potentialFriend={potentialFriend}
          setPhone={setPhone}
          setPotentialFriend={setPotentialFriend}
          {...props}
        />
      )}
    </View>
  )

  async function submit() {
    const phoneNumber = formatPhoneNumber(phone)
    // console.log('called EnterFriendPhone.submit() ', phoneNumber)
    let foundUser

    setError(undefined)
    textInput.current?.blur()

    if (phoneNumber === user!.phoneNumber) {
      return setError("You can't send a request to yourself, silly 😅")
    }

    if (outgoingFriendRequests.some(request => request.to_phone === phoneNumber)) {
      return setError('You already sent them a friend request')
    }

    setSubmitting(true)
    setPotentialFriend(undefined)

    try {
      const doc = await firestore()
        .collection('users')
        .doc(phoneNumber)
        .get()

      if (doc.exists) {
        foundUser = { id: doc.id, ...doc.data() }
      }
    } catch (err) {
      return setError(err.toString())
    }
    setSubmitting(false)

    if (!foundUser) {
      return setError(
        "Can't find anyone with that number.\nAre you sure it's correct?\n\nThey need a display name to become visible.",
      )
    }

    setPotentialFriend(foundUser)
  }
}

export default EnterFriendPhone
