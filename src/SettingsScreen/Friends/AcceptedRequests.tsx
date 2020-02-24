import firestore from '@react-native-firebase/firestore'
import React from 'react'
import { Alert, Platform, Switch, Text, TouchableOpacity, View } from 'react-native'

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
  const tuple: [
    FriendRequest[],
    (request: FriendRequest) => string,
    (request: FriendRequest) => string,
    (request: FriendRequest) => boolean,
    (request: FriendRequest) => object,
  ][] = [
    [
      acceptedIncomingFriendRequests,
      request => request.from_name,
      request => request.from_phone,
      request => request.to_notifs,
      request => ({ to_notifs: !request.to_notifs }),
    ],
    [
      acceptedOutgoingFriendRequests,
      request => request.to_name,
      request => request.to_phone,
      request => request.from_notifs,
      request => ({ from_notifs: !request.from_notifs }),
    ],
  ]

  return (
    <>
      <Text style={{ color: '#fff7', fontWeight: '600', marginTop: 30 }}>Accepted:</Text>
      {tuple.map(([requests, getName, getPhone, getNotifs, toggleNotifs]) =>
        requests?.map(request => (
          <View key={request.id} style={{ flexDirection: 'row', marginTop: 15, opacity: getNotifs(request) ? 1 : 0.3 }}>
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
            <Switch
              onValueChange={() =>
                firestore()
                  .collection('friendRequests')
                  .doc(request.id)
                  .update(toggleNotifs(request))
              }
              style={{
                alignSelf: 'flex-end',
                marginLeft: 'auto',
                paddingVertical: 10,
                transform: Platform.OS === 'ios' ? [{ scaleX: 0.8 }, { scaleY: 0.8 }] : [],
              }}
              thumbColor="white"
              trackColor={{ false: 'null', true: 'rgb(10, 132, 255)' }}
              value={getNotifs(request)}
            />
          </View>
        )),
      )}
    </>
  )
}

export default AcceptedRequests
