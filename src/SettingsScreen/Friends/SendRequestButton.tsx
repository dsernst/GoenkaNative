import { FirebaseAuthTypes } from '@react-native-firebase/auth'
import firestore from '@react-native-firebase/firestore'
import React, { Dispatch, useState } from 'react'
import { Text, TouchableOpacity, View } from 'react-native'
import OneSignal from 'react-native-onesignal'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'

import { prettyDisplayPhone } from './phone-helpers'

function SendRequestButton({
  onesignal_id,
  potentialFriend,
  setPhone,
  setPotentialFriend,
  user,
}: {
  onesignal_id: string | null
  potentialFriend: { id: string; onesignal_id: string }
  setPhone: Dispatch<string>
  setPotentialFriend: Dispatch<undefined>
  user: FirebaseAuthTypes.User
}) {
  const [error, setError] = useState()
  const [submitting, setSubmitting] = useState(false)

  return (
    <View style={{ marginTop: 30 }}>
      <Text style={{ color: '#fffc' }}>Found! Send friend request?</Text>

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
        <MaterialIcons
          color="#fffa"
          name="person-add"
          size={20}
          style={{ paddingLeft: 4, paddingRight: 8, paddingTop: 2 }}
        />
        <Text style={{ color: '#fff9', fontSize: 18, fontWeight: '600' }}>Send Friend Request</Text>
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
    </View>
  )

  async function submit() {
    setError(undefined)
    setSubmitting(true)
    try {
      console.log('send a friend request to:', potentialFriend.id)
      firestore()
        .collection('friendRequests')
        .add({
          created_at: new Date(),
          from_onesignal_id: onesignal_id,
          from_phone: user.phoneNumber,
          to_onesignal_id: potentialFriend.onesignal_id,
          to_phone: potentialFriend.id,
        })
      OneSignal.postNotification({ en: `New friend request from ${prettyDisplayPhone(user.phoneNumber!)}` }, {}, [
        potentialFriend.onesignal_id,
      ])
    } catch (err) {
      return setError(err.toString())
    }
    setSubmitting(false)
    setPotentialFriend(undefined)
    setPhone('')
  }
}

export default SendRequestButton
