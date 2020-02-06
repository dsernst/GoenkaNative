import auth from '@react-native-firebase/auth'
import firestore from '@react-native-firebase/firestore'
import React, { useEffect, useState } from 'react'
import { Alert, Text, TouchableOpacity, View } from 'react-native'
import Octicons from 'react-native-vector-icons/Octicons'

import { Props } from '../../reducer'

const EnterPhone = ({ history, user }: Props) => {
  const [onlineSits, setOnlineSits] = useState([])
  const [loading, setLoading] = useState(true)

  // On load, fetch our users and subscribe to updates
  useEffect(() => {
    const unsubscribe = firestore()
      .collection('sits')
      .onSnapshot(querySnapshot => {
        // Add users into an array
        const sits = querySnapshot.docs.map(documentSnapshot => {
          return {
            ...documentSnapshot.data(),
            key: documentSnapshot.id, // required for FlatList
          }
        })

        // Update state with the sits array
        setOnlineSits(sits)

        // As this can trigger multiple times, only update loading after the first update
        if (loading) {
          setLoading(false)
        }
      })

    return () => unsubscribe() // Stop listening for updates whenever the component unmounts
  }, [loading])

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
        &nbsp;sit{history.length !== 1 && 's'} recorded on this devices,
      </Text>

      {/* Sits online: y */}
      <Text style={{ color: '#fff9', fontSize: 16, marginTop: 30, paddingLeft: 39 }}>
        and&nbsp;
        <Text style={{ color: '#fffd', fontWeight: '500' }}>{loading ? '...' : onlineSits.length}</Text>
        &nbsp;sit{onlineSits.length !== 1 && 's'} saved online.
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
