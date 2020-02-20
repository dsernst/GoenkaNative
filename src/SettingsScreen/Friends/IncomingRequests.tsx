import firestore from '@react-native-firebase/firestore'
import React from 'react'
import { Text, TouchableOpacity, View } from 'react-native'

import { PendingFriendRequest } from '../../reducer'
import { prettyDisplayPhone } from './phone-helpers'

function IncomingRequests({ incomingFriendRequests }: { incomingFriendRequests: PendingFriendRequest[] }) {
  return (
    <>
      <Text style={{ color: '#fffa', fontWeight: '600', marginTop: 30 }}>
        <Text style={{ color: '#DCDC33dd' }}>{incomingFriendRequests.length}</Text>&nbsp; Incoming Friend Request
        {incomingFriendRequests.length > 1 ? 's' : ''}
      </Text>
      {incomingFriendRequests?.map(request => (
        <View key={request.id} style={{ alignItems: 'center', flexDirection: 'row', marginTop: 15 }}>
          <Text style={{ color: '#fffa' }}>{prettyDisplayPhone(request.to_phone)}:&nbsp; &nbsp; &nbsp;</Text>
          <TouchableOpacity
            onPress={() =>
              firestore()
                .collection('pendingFriendRequests')
                .doc(request.id)
                .update({ rejected: new Date() })
            }
          >
            <Text style={{ color: '#ff5e5eee' }}>✗&nbsp; Reject</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() =>
              firestore()
                .collection('pendingFriendRequests')
                .doc(request.id)
                .update({ accepted: new Date() })
            }
            style={{ marginLeft: 30 }}
          >
            <Text style={{ color: '#9CDCFEee' }}>✓ Accept</Text>
          </TouchableOpacity>
        </View>
      ))}
    </>
  )
}

export default IncomingRequests
