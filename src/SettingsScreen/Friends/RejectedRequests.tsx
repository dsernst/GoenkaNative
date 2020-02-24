import firestore from '@react-native-firebase/firestore'
import React from 'react'
import { Text, TouchableOpacity, View } from 'react-native'

import { FriendRequest } from '../../reducer'
import { prettyDisplayPhone } from './phone-helpers'

function RejectedRequests({ rejectedFriendRequests }: { rejectedFriendRequests: FriendRequest[] }) {
  return (
    <>
      <Text style={{ color: '#fffa', fontWeight: '600', marginTop: 30 }}>Rejected Friend Requests:</Text>
      {rejectedFriendRequests?.map(request => (
        <View key={request.id} style={{ alignItems: 'center', flexDirection: 'row', marginTop: 15 }}>
          <Text style={{ color: '#fffa' }}>{prettyDisplayPhone(request.from_phone)}&nbsp; &nbsp;—&nbsp; &nbsp;</Text>
          <TouchableOpacity
            onPress={() =>
              firestore()
                .collection('friendRequests')
                .doc(request.id)
                .update({
                  accepted: new Date(),
                  rejected: firestore.FieldValue.delete(),
                })
            }
          >
            <Text style={{ color: '#9CDCFEee' }}>Accept</Text>
          </TouchableOpacity>
        </View>
      ))}
    </>
  )
}

export default RejectedRequests
