import { FirebaseAuthTypes } from '@react-native-firebase/auth'
import auth from '@react-native-firebase/auth'
import React from 'react'
import { Alert, AlertButton, Text, TouchableOpacity, View } from 'react-native'
import AntDesign from 'react-native-vector-icons/AntDesign'

import { Props } from '../reducer'
import { prettyDisplayPhone } from './Friends/phone-helpers'

type AuthInfoProps = Props & { user: FirebaseAuthTypes.User }

function AuthedInfo({ displayName, setState, user }: AuthInfoProps) {
  const alertButtons: AlertButton[] = displayName
    ? [
        {
          onPress: async () => setState({ displayName: null }),
          text: 'Reset Display Name',
        },
      ]
    : []

  alertButtons.push(
    {
      onPress: () => auth().signOut(),
      style: 'destructive',
      text: 'Logout',
    },
    { style: 'cancel', text: 'Cancel' },
  )

  return (
    <View style={{ alignItems: 'center', flexDirection: 'row', left: 17, marginBottom: 30, marginTop: 10 }}>
      <AntDesign color="#fff8" name="checkcircle" size={19} style={{ marginRight: 15, top: 1 }} />
      <TouchableOpacity
        onPress={() =>
          Alert.alert(
            'Logged in as:',
            `${displayName ? displayName + ' ' : ''}${prettyDisplayPhone(user.phoneNumber!)}`,
            alertButtons,
          )
        }
        style={{ alignItems: 'center', flexDirection: 'row' }}
      >
        <Text style={{ color: '#fff9', marginRight: 15 }}>Logged in as:</Text>
        <Text style={{ color: '#fffb', fontStyle: displayName ? 'normal' : 'italic', fontWeight: '500' }}>
          {displayName ? displayName : prettyDisplayPhone(user.phoneNumber!)}
        </Text>
      </TouchableOpacity>
    </View>
  )
}

export default AuthedInfo
