import React from 'react'
import { Text } from 'react-native'

function PendingRequests({ pendingFriendRequests }) {
  return (
    <>
      <Text style={{ color: '#fffa', fontWeight: '600', marginTop: 30 }}>Outgoing Friend Requests:</Text>
      {pendingFriendRequests.map(request => (
        <Text key={request.id} style={{ color: '#fffa', marginTop: 15 }}>
          {prettyDisplayPhone(request.to_phone)}
        </Text>
      ))}
    </>
  )
}

function prettyDisplayPhone(phone: string) {
  return phone.length !== 12
    ? phone
    : `${phone.slice(0, 2)} ${phone.slice(2, 5)} ${phone.slice(5, 8)} ${phone.slice(8, 12)}`
}

export default PendingRequests
