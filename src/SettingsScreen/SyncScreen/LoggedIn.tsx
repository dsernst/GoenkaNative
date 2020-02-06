import auth from '@react-native-firebase/auth'
import React from 'react'
import { Text, TouchableOpacity, View } from 'react-native'

import { Props } from '../../reducer'

const EnterPhone = ({ user }: Props) => {
  return (
    <>
      <View style={{ alignItems: 'center', flexDirection: 'row', marginTop: 30 }}>
        <Text style={{ color: '#fff9' }}>
          Verified as:&nbsp;&nbsp;&nbsp;
          <Text style={{ alignSelf: 'center', color: '#fffd', fontStyle: 'italic', fontWeight: '500' }}>
            {prettyPhoneNumber(user!.phoneNumber!)}
          </Text>
        </Text>
        <TouchableOpacity
          onPress={async () => {
            await auth().signOut()
          }}
          style={{ marginLeft: 'auto', padding: 10, paddingRight: 0 }}
        >
          <Text style={{ color: '#c7dcff' }}>( Logout )</Text>
        </TouchableOpacity>
      </View>
    </>
  )
}

function prettyPhoneNumber(phoneNumber: string) {
  return `${phoneNumber.slice(0, -10)} ${phoneNumber.slice(-10, -7)}-${phoneNumber.slice(-7, -4)}-${phoneNumber.slice(
    -4,
  )}`
}

export default EnterPhone
