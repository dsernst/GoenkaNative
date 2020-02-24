import { FirebaseAuthTypes } from '@react-native-firebase/auth'
import auth from '@react-native-firebase/auth'
import React from 'react'
import { Alert, Text, TouchableOpacity, View } from 'react-native'
import AntDesign from 'react-native-vector-icons/AntDesign'

import { Props } from '../reducer'
import { prettyDisplayPhone } from './Friends/phone-helpers'

type AuthInfoProps = Props & { user: FirebaseAuthTypes.User }

function AuthedInfo({ displayName, setState, user }: AuthInfoProps) {
  return (
    <View style={{ alignItems: 'center', flexDirection: 'row', left: 17, marginBottom: 30, marginTop: 10 }}>
      <AntDesign color="#fff8" name="checkcircle" size={19} style={{ marginRight: 15, top: 1 }} />
      <TouchableOpacity
        onPress={() =>
          Alert.alert('What would you like to do?', '', [
            { style: 'cancel', text: 'Cancel' },
            {
              onPress: async () => setState({ displayName: null }),
              style: 'destructive',
              text: 'Reset Display Name',
            },
            {
              onPress: () => auth().signOut(),
              style: 'destructive',
              text: 'Logout',
            },
          ])
        }
        style={{ alignItems: 'center', flexDirection: 'row' }}
      >
        <Text style={{ color: '#fff9' }}>Logged in as:</Text>
        <View style={{ marginBottom: 10, paddingLeft: 15, top: 15 }}>
          <Text style={{ color: '#fffb', fontWeight: '500' }}>{displayName}</Text>
          <Text style={{ color: '#fff7', fontStyle: 'italic', marginTop: 2 }}>
            {prettyDisplayPhone(user.phoneNumber!)}
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  )
}

export default AuthedInfo
