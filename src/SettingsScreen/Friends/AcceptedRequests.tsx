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
      <Text style={{ color: '#fffa', fontWeight: '600', marginTop: 30 }}>Friends:</Text>
      {acceptedIncomingFriendRequests?.map(request => (
        <View key={request.id} style={{ alignItems: 'center', flexDirection: 'row', marginTop: 15 }}>
          <TouchableOpacity
            onPress={() =>
              Alert.alert('Are you sure?', 'This will stop them from seeing your notifications as well.', [
                { text: 'Cancel' },
                {
                  onPress: () =>
                    firestore()
                      .collection('friendRequests')
                      .doc(request.id)
                      .update({
                        accepted: firestore.FieldValue.delete(),
                        rejected: new Date(),
                      }),
                  style: 'destructive',
                  text: 'Delete',
                },
              ])
            }
          >
            <Text style={{ color: '#ff5e5eee' }}>&nbsp; ✗&nbsp; </Text>
          </TouchableOpacity>
          <Text style={{ color: '#fffa' }}>&nbsp; {prettyDisplayPhone(request.from_phone)}</Text>
        </View>
      ))}
      {acceptedOutgoingFriendRequests?.map(request => (
        <View key={request.id} style={{ alignItems: 'center', flexDirection: 'row', marginTop: 15 }}>
          <TouchableOpacity
            onPress={() =>
              Alert.alert('Are you sure?', 'This will stop them from seeing your notifications as well.', [
                { text: 'Cancel' },
                {
                  onPress: () =>
                    firestore()
                      .collection('friendRequests')
                      .doc(request.id)
                      .delete(),
                  style: 'destructive',
                  text: 'Delete',
                },
              ])
            }
          >
            <Text style={{ color: '#ff5e5eee' }}>&nbsp; ✗&nbsp; </Text>
          </TouchableOpacity>
          <Text style={{ color: '#fffa' }}>&nbsp; {prettyDisplayPhone(request.to_phone)}</Text>
        </View>
      ))}
    </>
  )
}

export default AcceptedRequests
