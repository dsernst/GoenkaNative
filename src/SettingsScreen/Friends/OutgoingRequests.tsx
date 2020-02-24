import firestore from '@react-native-firebase/firestore'
import React from 'react'
import { Text, TouchableOpacity, View } from 'react-native'

import { FriendRequest } from '../../reducer'
import { prettyDisplayPhone } from './phone-helpers'

function OutgoingRequests({ outgoingFriendRequests }: { outgoingFriendRequests: FriendRequest[] }) {
  return (
    <>
      <Text style={{ color: '#fffa', fontWeight: '600', marginTop: 30 }}>Outgoing Friend Requests:</Text>
      {outgoingFriendRequests?.map(request => (
        <View key={request.id} style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 15 }}>
          <View style={{ maxWidth: 140 }}>
            <Text style={{ color: '#fffa' }}>{request.to_name}</Text>
            <Text style={{ color: '#fff5' }}>{prettyDisplayPhone(request.to_phone)}</Text>
          </View>
          <View style={{ alignItems: 'center', flexDirection: 'row' }}>
            <TouchableOpacity
              onPress={() =>
                firestore()
                  .collection('friendRequests')
                  .doc(request.id)
                  .delete()
              }
            >
              <Text style={{ color: '#ff5e5eee' }}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}
    </>
  )
}

export default OutgoingRequests
