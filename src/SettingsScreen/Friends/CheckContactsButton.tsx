import React, { useState } from 'react'
import { Alert, PermissionsAndroid, Platform, Text, TouchableOpacity } from 'react-native'
import Contacts from 'react-native-contacts'
import AntDesign from 'react-native-vector-icons/AntDesign'

import { ContactWithType, Props } from '../../reducer'
import { formatPhoneNumber } from './phone-helpers'

function CheckContactsButton({
  acceptedIncomingFriendRequests,
  acceptedOutgoingFriendRequests,
  contacts,
  contactsNotOnApp,
  incomingFriendRequests,
  outgoingFriendRequests,
  recentlyJoinedContacts,
  setState,
}: Props) {
  const [loading, setLoading] = useState(false)

  return (
    <>
      <TouchableOpacity
        onPress={async () => {
          if (Platform.OS === 'android') {
            const permission = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.READ_CONTACTS)
            if (permission === 'denied') {
              return
            } else if (permission === 'never_ask_again') {
              return Alert.alert(
                'You blocked this app from seeing Contacts',
                'To re-enable, go to Settings > Apps & notifications > Goenka Timer > Permissions > Contacts.',
              )
            }
          }

          setLoading(true)

          if (contacts) {
            return setState({ screen: 'CheckContactsScreen' })
          }

          Contacts.getAllWithoutPhotos((err, loadedContacts: ContactWithType[]) => {
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

            const pendingRequestsPhones = [
              ...incomingFriendRequests.map(fr => fr.from_phone),
              ...outgoingFriendRequests.map(fr => fr.to_phone),
            ]

            const alreadyFriendsPhones = [
              ...acceptedIncomingFriendRequests.map(fr => fr.from_phone),
              ...acceptedOutgoingFriendRequests.map(fr => fr.to_phone),
            ]

            console.log('🔍 Marking contacts we already know about')
            loadedContacts?.forEach(async contact => {
              const phoneNumbers = contact.phoneNumbers.map(pN => formatPhoneNumber(pN.number))

              if (phoneNumbers.some(n => alreadyFriendsPhones.includes(n))) {
                contact.type = 'alreadyFriends'
              } else if (phoneNumbers.some(n => pendingRequestsPhones.includes(n))) {
                contact.type = 'pendingRequests'
              } else if (phoneNumbers.some(n => recentlyJoinedContacts.map(c => c.phoneNumber).includes(n))) {
                contact.type = 'availableToFriend'
              } else if (phoneNumbers.some(n => contactsNotOnApp.map(c => c.phoneNumber).includes(n))) {
                contact.type = 'notOnApp'
              }
            })

            setState({ contacts: loadedContacts, screen: 'CheckContactsScreen' })
          })
        }}
        style={{
          alignItems: 'center',
          borderColor: '#fff4',
          borderRadius: 4,
          borderWidth: 1,
          flexDirection: 'row',
          justifyContent: 'center',
          marginBottom: 20,
          marginHorizontal: 20,
          paddingVertical: 5,
        }}
      >
        <AntDesign color="#fff9" name="contacts" size={18} style={{ paddingRight: 10 }} />
        <Text style={{ color: '#fffb', fontSize: 16 }}>Check phone contacts</Text>
      </TouchableOpacity>

      {loading && (
        <Text style={{ alignSelf: 'center', bottom: 10, color: '#fff6', fontSize: 14, marginBottom: 10 }}>
          Loading...
        </Text>
      )}
    </>
  )
}

export default CheckContactsButton
