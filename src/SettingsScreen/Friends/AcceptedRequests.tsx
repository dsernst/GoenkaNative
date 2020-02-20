import firestore from '@react-native-firebase/firestore'
import React from 'react'
import { Text, TouchableOpacity, View } from 'react-native'

import { PendingFriendRequest } from '../../reducer'
import { prettyDisplayPhone } from './phone-helpers'

function AcceptedRequests({ acceptedFriendRequests }: { acceptedFriendRequests: PendingFriendRequest[] }) {
  return (
    <>
      <Text style={{ color: '#fffa', fontWeight: '600', marginTop: 30 }}>Friends:</Text>
      {acceptedFriendRequests?.map(request => (
        <View key={request.id} style={{ alignItems: 'center', flexDirection: 'row', marginTop: 15 }}>
          <Text style={{ color: '#fffa' }}>{prettyDisplayPhone(request.to_phone)}&nbsp; &nbsp;—&nbsp; &nbsp;</Text>
          <TouchableOpacity
            onPress={() =>
              firestore()
                .collection('pendingFriendRequests')
                .doc(request.id)
                .update({
                  accepted: firestore.FieldValue.delete(),
                  rejected: new Date(),
                })
            }
          >
            <Text style={{ color: '#9CDCFEee' }}>Delete</Text>
          </TouchableOpacity>
        </View>
      ))}
    </>
  )
}

export default AcceptedRequests
