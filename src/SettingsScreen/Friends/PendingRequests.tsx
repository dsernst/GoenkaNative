import firestore from '@react-native-firebase/firestore'
import React from 'react'
import { Text, TouchableOpacity, View } from 'react-native'

import { PendingFriendRequest } from '../../reducer'
import { prettyDisplayPhone } from './phone-helpers'

function PendingRequests({ pendingFriendRequests }: { pendingFriendRequests: PendingFriendRequest[] }) {
  return (
    <>
      <Text style={{ color: '#fffa', fontWeight: '600', marginTop: 30 }}>Outgoing Friend Requests:</Text>
      {pendingFriendRequests?.map(request => (
        <View key={request.id} style={{ alignItems: 'center', flexDirection: 'row', marginTop: 15 }}>
          <Text style={{ color: '#fffa' }}>{prettyDisplayPhone(request.to_phone)}&nbsp; &nbsp;—&nbsp; &nbsp;</Text>
          <TouchableOpacity
            onPress={() =>
              firestore()
                .collection('pendingFriendRequests')
                .doc(request.id)
                .delete()
            }
          >
            <Text style={{ color: '#9CDCFEee' }}>Cancel</Text>
          </TouchableOpacity>
        </View>
      ))}
    </>
  )
}

export default PendingRequests
