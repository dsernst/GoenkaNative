import { FirebaseAuthTypes } from '@react-native-firebase/auth'
import firestore from '@react-native-firebase/firestore'
import React, { useState } from 'react'
import { Text, TouchableOpacity, View } from 'react-native'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'

function SendRequestButton({
  potentialFriend,
  user,
}: {
  potentialFriend: { id: string; phone: string }
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
      console.log('send a friend request to:', potentialFriend.phone)
      firestore()
        .collection('pendingFriendRequests')
        .add({
          created_at: new Date(),
          from: user.uid,
          to_phone: potentialFriend.phone,
          to_user_id: potentialFriend.id,
        })
    } catch (err) {
      return setError(err.toString())
    }
    setSubmitting(false)
  }
}

export default SendRequestButton