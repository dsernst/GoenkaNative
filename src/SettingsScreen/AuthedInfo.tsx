import auth from '@react-native-firebase/auth'
import React from 'react'
import { Alert, Text, TouchableOpacity, View } from 'react-native'

import { Props } from '../reducer'
import { prettyDisplayPhone } from './Friends/phone-helpers'

function AuthedInfo({ user }: Props) {
  return (
    <View style={{ alignItems: 'center', flexDirection: 'row', marginBottom: 30, paddingLeft: 10 }}>
      <Text style={{ color: '#fff9' }}>Verified as:</Text>
      <TouchableOpacity
        onLongPress={() =>
          Alert.alert('Would you like to logout?', '', [
            { text: 'Cancel' },
            {
              onPress: async () => {
                await auth().signOut()
              },
              style: 'destructive',
              text: 'Logout',
            },
          ])
        }
        style={{ padding: 10, paddingRight: 0 }}
      >
        <Text style={{ alignSelf: 'center', color: '#fffd', fontStyle: 'italic', fontWeight: '500' }}>
          {prettyDisplayPhone(user.phoneNumber!)}
        </Text>
      </TouchableOpacity>
    </View>
  )
}

export default AuthedInfo
