import firestore from '@react-native-firebase/firestore'
import React, { useState } from 'react'
import { Text, TextInput, TouchableOpacity, View } from 'react-native'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import Ionicons from 'react-native-vector-icons/Ionicons'

import { Props } from '../../reducer'

function SetDisplayName({ backgroundColor, onesignal_id, setState, user }: Props) {
  const [name, setName] = useState('')

  return (
    <View style={{ borderColor: '#f8ff7044', borderRadius: 8, borderWidth: 1, padding: 10 }}>
      <Text
        style={{
          alignSelf: 'center',
          backgroundColor,
          color: '#fff7',
          paddingHorizontal: 10,
          position: 'absolute',
          top: -9,
        }}
      >
        <FontAwesome color="#f8ff7099" name="user" size={15} />
        &nbsp; Set Display Name
      </Text>

      <Text style={{ color: '#fffb', marginTop: 15 }}>How can other people recognize you?</Text>

      <View style={{ flexDirection: 'row', marginTop: 10 }}>
        <TextInput
          autoCorrect={false}
          autoFocus
          onChangeText={setName}
          placeholder="Jordan Riley"
          placeholderTextColor="#fff5"
          style={{
            backgroundColor: '#353d38',
            borderRadius: 7,
            color: '#fffd',
            flex: 1,
            fontSize: 18,
            padding: 10,
          }}
          value={name}
        />

        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => {
            setState({ displayName: name })
            firestore()
              .collection('users')
              .doc(user!.phoneNumber!)
              .set({ name, onesignal_id })
          }}
          style={{
            alignItems: 'center',
            borderColor: '#fff3',
            borderRadius: 5,
            borderWidth: 1,
            flexDirection: 'row',
            justifyContent: 'center',
            marginLeft: 10,
            paddingHorizontal: 13,
          }}
        >
          <Ionicons color="#fffa" name="ios-save" size={15} style={{ paddingRight: 12, paddingTop: 1 }} />
          <Text style={{ color: '#fff9', fontSize: 16, fontWeight: '500' }}>Set</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default SetDisplayName
