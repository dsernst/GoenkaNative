import React, { useState } from 'react'
import { Text, TextInput, TouchableOpacity, View } from 'react-native'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import Foundation from 'react-native-vector-icons/Foundation'

function SetDisplayName() {
  const [name, setName] = useState('')

  return (
    <>
      <Text style={{ color: '#fffb', fontWeight: '600', marginTop: 10 }}>
        <FontAwesome name="user" size={15} />
        &nbsp; Set Display Name
      </Text>

      <Text style={{ color: '#fffb', marginTop: 10 }}>How can other people recognize you?</Text>

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
          //   onPress={submit}
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
          <Foundation color="#fffa" name="save" size={15} style={{ paddingRight: 12, paddingTop: 1 }} />
          <Text style={{ color: '#fff9', fontSize: 16, fontWeight: '500' }}>Set</Text>
        </TouchableOpacity>
      </View>
    </>
  )
}

export default SetDisplayName
