import auth from '@react-native-firebase/auth'
import React from 'react'
import { Alert, Text, TouchableOpacity, View } from 'react-native'
import Octicons from 'react-native-vector-icons/Octicons'

import { Props } from '../../reducer'

const EnterPhone = ({ history, user }: Props) => {
  return (
    <>
      {/* Login Info */}
      <View style={{ alignItems: 'center', flexDirection: 'row', marginTop: 30 }}>
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
            {prettyPhoneNumber(user!.phoneNumber!)}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Sits on device: x */}
      <Text style={{ color: '#fff9', fontSize: 16, marginTop: 60 }}>
        You have&nbsp;
        <Text style={{ color: '#56cc6a', fontWeight: '500' }}>{history.length}</Text>
        &nbsp;sits recorded on this devices,
      </Text>

      {/* Sits online: y */}
      <Text style={{ color: '#fff9', fontSize: 16, marginTop: 30, paddingLeft: 39 }}>
        and&nbsp;
        <Text style={{ color: '#fffd', fontWeight: '500' }}>0</Text>
        &nbsp;sits saved online.
      </Text>

      {/* Sync now btn */}
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => {}}
        style={{
          alignItems: 'center',
          alignSelf: 'center',
          borderColor: '#fff7',
          borderRadius: 8,
          borderWidth: 1,
          flexDirection: 'row',
          marginTop: 30,
          paddingHorizontal: 15,
          paddingVertical: 7,
        }}
      >
        <Octicons color="#fffa" name={'sync'} size={18} style={{ paddingLeft: 4, paddingTop: 2, width: 30 }} />
        <Text style={{ color: '#fff9', fontSize: 18 }}>Sync now</Text>
      </TouchableOpacity>

      {/* Show confirmation: 'Your 24 sits over the last 3 weeks have been backed up.' */}
    </>
  )
}

function prettyPhoneNumber(phoneNumber: string) {
  return `${phoneNumber.slice(0, -10)} ${phoneNumber.slice(-10, -7)}-${phoneNumber.slice(-7, -4)}-${phoneNumber.slice(
    -4,
  )}`
}

export default EnterPhone
