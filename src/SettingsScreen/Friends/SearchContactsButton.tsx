import React from 'react'
import { Alert, Text, TouchableOpacity } from 'react-native'
import Contacts from 'react-native-contacts'
import AntDesign from 'react-native-vector-icons/AntDesign'

import { Props } from '../../reducer'

function SearchContactsButton({ setState }: Props) {
  return (
    <TouchableOpacity
      onPress={() => {
        Contacts.getAllWithoutPhotos((err, contacts) => {
          if (err) {
            if (err === 'denied') {
              return Alert.alert(
                'You blocked this app from seeing Contacts',
                'To re-enable, go to Settings.app > GoenkaTimer > Contacts.',
              )
            }
            console.log(err)
            return Alert.alert(err)
          }
          setState({ contacts, screen: 'CheckContactsScreen' })
        })
      }}
      style={{
        alignItems: 'center',
        borderColor: '#fff7',
        borderRadius: 4,
        borderWidth: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 15,
        marginHorizontal: 25,
        paddingVertical: 5,
      }}
    >
      <AntDesign color="#fff9" name="contacts" size={18} style={{ paddingRight: 10 }} />
      <Text style={{ color: '#fffb', fontSize: 16 }}>Check phone contacts</Text>
    </TouchableOpacity>
  )
}

export default SearchContactsButton
