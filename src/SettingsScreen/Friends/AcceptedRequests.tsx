import firestore from '@react-native-firebase/firestore'
import React from 'react'
import { Alert, Text, TouchableOpacity, View } from 'react-native'

import { FriendRequest } from '../../reducer'
import { prettyDisplayPhone } from './phone-helpers'

function AcceptedRequests({
  acceptedIncomingFriendRequests,
  acceptedOutgoingFriendRequests,
}: {
  acceptedIncomingFriendRequests: FriendRequest[]
  acceptedOutgoingFriendRequests: FriendRequest[]
}) {
  return (
    <>
      <Text style={{ color: '#fffa', fontWeight: '600', marginTop: 30 }}>Accepted:</Text>
      {acceptedIncomingFriendRequests?.map(request => (
        <View key={request.id} style={{ flexDirection: 'row', marginTop: 15 }}>
          <TouchableOpacity
            onPress={() =>
              Alert.alert(
                `Unfriend ${request.from_name}?`,
                'Are you sure? This will stop them from seeing your notifications as well.',
                [
                  { text: 'Cancel' },
                  {
                    onPress: () =>
                      firestore()
                        .collection('friendRequests')
                        .doc(request.id)
                        .delete(),
                    style: 'destructive',
                    text: 'Unfriend',
                  },
                ],
              )
            }
          >
            <Text style={{ color: '#ff5e5eee' }}>&nbsp; ✗&nbsp; </Text>
          </TouchableOpacity>
          <View style={{ marginLeft: 5 }}>
            <Text style={{ color: '#fffa' }}>&nbsp; {request.from_name}</Text>
            <Text style={{ color: '#fff5' }}>&nbsp; {prettyDisplayPhone(request.from_phone)}</Text>
          </View>
        </View>
      ))}
      {acceptedOutgoingFriendRequests?.map(request => (
        <View key={request.id} style={{ flexDirection: 'row', marginTop: 15 }}>
          <TouchableOpacity
            onPress={() =>
              Alert.alert(
                `Unfriend ${request.to_name}?`,
                'Are you sure? This will stop them from seeing your notifications as well.',
                [
                  { text: 'Cancel' },
                  {
                    onPress: () =>
                      firestore()
                        .collection('friendRequests')
                        .doc(request.id)
                        .delete(),
                    style: 'destructive',
                    text: 'Unfriend',
                  },
                ],
              )
            }
          >
            <Text style={{ color: '#ff5e5eee' }}>&nbsp; ✗&nbsp; </Text>
          </TouchableOpacity>
          <View style={{ marginLeft: 5 }}>
            <Text style={{ color: '#fffa' }}>&nbsp; {request.to_name}</Text>
            <Text style={{ color: '#fff5' }}>&nbsp; {prettyDisplayPhone(request.to_phone)}</Text>
          </View>
        </View>
      ))}
    </>
  )
}

export default AcceptedRequests
