import { FirebaseAuthTypes } from '@react-native-firebase/auth'
import auth from '@react-native-firebase/auth'
import React from 'react'
import { Alert, Text, TouchableOpacity, View } from 'react-native'
import AntDesign from 'react-native-vector-icons/AntDesign'

import { prettyDisplayPhone } from './Friends/phone-helpers'

function AuthedInfo({ user }: { user: FirebaseAuthTypes.User }) {
  return (
    <View style={{ alignItems: 'center', flexDirection: 'row', left: 17, marginBottom: 30, marginTop: 10 }}>
      <AntDesign color="#fff8" name="checkcircle" size={19} style={{ marginRight: 15, top: 1 }} />
      <TouchableOpacity
        onPress={() =>
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
        style={{ alignItems: 'center', flexDirection: 'row' }}
      >
        <Text style={{ color: '#fff9' }}>Logged in as:</Text>
        <Text style={{ alignSelf: 'center', color: '#fffd', fontStyle: 'italic', fontWeight: '500', padding: 10 }}>
          {prettyDisplayPhone(user.phoneNumber!)}
        </Text>
      </TouchableOpacity>
    </View>
  )
}

export default AuthedInfo
