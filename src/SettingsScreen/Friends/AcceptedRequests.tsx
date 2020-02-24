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
  // Unique values for incoming vs outgoing friend requests
  const tuple: [FriendRequest[], (request: FriendRequest) => string, (request: FriendRequest) => string][] = [
    [acceptedIncomingFriendRequests, request => request.from_name, request => request.from_phone],
    [acceptedOutgoingFriendRequests, request => request.to_name, request => request.to_phone],
  ]

  return (
    <>
      <Text style={{ color: '#fff7', fontWeight: '600', marginTop: 30 }}>Accepted:</Text>
      {tuple.map(([requests, getName, getPhone]) =>
        requests?.map(request => (
          <View key={request.id} style={{ flexDirection: 'row', marginTop: 15 }}>
            <TouchableOpacity
              onPress={() =>
                Alert.alert(
                  `Unfriend ${getName(request)}?`,
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
              <Text style={{ color: '#fffb' }}>&nbsp; {getName(request)}</Text>
              <Text style={{ color: '#fff5' }}>&nbsp; {prettyDisplayPhone(getPhone(request))}</Text>
            </View>
          </View>
        )),
      )}
    </>
  )
}

export default AcceptedRequests
