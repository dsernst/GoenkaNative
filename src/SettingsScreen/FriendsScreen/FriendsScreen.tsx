import firestore from '@react-native-firebase/firestore'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { Text, TextInput, TouchableOpacity } from 'react-native'

import BackButton from '../../BackButton'
import { Props } from '../../reducer'
import TitleBar from '../../TitleBar'
import EnterFriendPhone from './EnterFriendPhone'
import PendingRequests from './PendingRequests'

const FriendsScreen = (props: Props) => {
  const { user } = props
  const [pendingFriendRequests, setPendingFriendRequests] = useState()
  const textInput = useRef<TextInput>(null)

  const getPendingRequests = useCallback(
    () =>
      firestore()
        .collection('pendingFriendRequests')
        .where('from', '==', user.uid),
    // .orderBy('date', 'desc'),
    [user.uid],
  )

  // On load, fetch our sits
  useEffect(() => {
    console.log('Subscribing to pending friend requests')
    const unsubscribe = getPendingRequests().onSnapshot(results => {
      console.log("firestore().collection('pendingFriendRequests').onSnapshot()")
      setPendingFriendRequests(results.docs.map(doc => ({ id: doc.id, ...doc.data() })))
    })

    return () => unsubscribe() // Stop listening for updates on unmount
  }, [getPendingRequests])

  return (
    <TouchableOpacity activeOpacity={1} onPress={() => textInput.current?.blur()} style={{ flex: 1 }}>
      <TitleBar name="FRIEND NOTIFICATIONS" />

      <Text
        style={{
          color: '#fff9',
          fontSize: 18,
          fontWeight: '600',
          marginTop: 14,
        }}
      >
        Add Friends
      </Text>

      <EnterFriendPhone textInput={textInput} user={props.user} />

      {pendingFriendRequests?.length && <PendingRequests pendingFriendRequests={pendingFriendRequests} />}

      <BackButton to="SettingsScreen" />
    </TouchableOpacity>
  )
}

export default FriendsScreen
