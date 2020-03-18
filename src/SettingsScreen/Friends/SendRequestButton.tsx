import firestore from '@react-native-firebase/firestore'
import React, { Dispatch, useState } from 'react'
import { Text, TouchableOpacity, View } from 'react-native'
import OneSignal from 'react-native-onesignal'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'

import { Props } from '../../reducer'
import { prettyDisplayPhone } from './phone-helpers'

export type User = { id: string; name: string; onesignal_id: string }

type SendRequestButtonProps = Props & {
  potentialFriend: User
  setPhone: Dispatch<string>
  setPotentialFriend: Dispatch<undefined>
}
function SendRequestButton({
  displayName,
  onesignal_id,
  potentialFriend,
  setPhone,
  setPotentialFriend,
  user,
}: SendRequestButtonProps) {
  const [error, setError] = useState()
  const [submitting, setSubmitting] = useState(false)

  return (
    <View style={{ marginTop: 30 }}>
      <Text style={{ color: '#fffa' }}>
        Found <Text style={{ color: '#fffc', fontWeight: '700' }}>{potentialFriend.name}</Text>!{'\n'}Send friend
        request?
      </Text>

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
          Sending...
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
      sendFriendRequest({
        from_name: displayName!,
        from_onesignal_id: onesignal_id!,
        from_phone: user!.phoneNumber!,
        to_name: potentialFriend.name,
        to_onesignal_id: potentialFriend.onesignal_id,
        to_phone: potentialFriend.id,
      })
    } catch (err) {
      return setError(err.toString())
    }
    setSubmitting(false)
    setPotentialFriend(undefined)
    setPhone('')
  }
}

export default SendRequestButton

export async function sendFriendRequest({
  from_name,
  from_onesignal_id,
  from_phone,
  to_name,
  to_onesignal_id,
  to_phone,
}: {
  from_name: string
  from_onesignal_id: string
  from_phone: string
  to_name: string
  to_onesignal_id: string
  to_phone: string
}) {
  console.log('👬 sending a friend request to:', to_phone)
  await firestore()
    .collection('friendRequests')
    .add({ created_at: new Date(), from_name, from_onesignal_id, from_phone, to_name, to_onesignal_id, to_phone })

  // Delete this persons recentlyJoinedContact entry for me (redundant w/ incomingFriendRequest)
  // Silently fails if there isn't one (which is ok)
  firestore()
    .collection('users')
    .doc(to_phone)
    .collection('contactsNotOnApp')
    .doc(from_phone)
    .delete()

  // Send them a notification
  OneSignal.postNotification({ en: `New friend request from ${from_name} (${prettyDisplayPhone(from_phone!)})` }, {}, [
    to_onesignal_id,
  ])
}
