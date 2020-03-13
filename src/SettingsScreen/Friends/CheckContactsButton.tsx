import React, { useState } from 'react'
import { Alert, PermissionsAndroid, Platform, Text, TouchableOpacity } from 'react-native'
import Contacts from 'react-native-contacts'
import AntDesign from 'react-native-vector-icons/AntDesign'

import { ContactType, ContactWithType, FriendRequest, Props } from '../../reducer'
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

            type AK = { name?: string; phone: string; type: ContactType }

            const FRtoAK = (type: ContactType, direction: string) => (fr: FriendRequest): AK => ({
              name: direction === 'to' ? fr.to_name : fr.from_name,
              phone: direction === 'to' ? fr.to_phone : fr.from_phone,
              type,
            })

            const alreadyKnown: AK[] = [
              ...incomingFriendRequests.map(FRtoAK('pendingRequests', 'from')),
              ...outgoingFriendRequests.map(FRtoAK('pendingRequests', 'to')),
              ...acceptedIncomingFriendRequests.map(FRtoAK('alreadyFriends', 'from')),
              ...acceptedOutgoingFriendRequests.map(FRtoAK('alreadyFriends', 'to')),
              ...recentlyJoinedContacts.map(
                (c): AK => ({ name: c.new_name, phone: c.phoneNumber, type: 'availableToFriend' }),
              ),
              ...contactsNotOnApp.map((c): AK => ({ phone: c.phoneNumber, type: 'notOnApp' })),
            ]

            console.log('🔍 Marking contacts we already know about')
            loadedContacts?.forEach(async contact => {
              contact.phoneNumbers
                .map(pN => formatPhoneNumber(pN.number))
                .some(n =>
                  alreadyKnown.some(
                    aK => aK.phone === n && (contact.type = aK.type) && (contact.display_name = aK.name),
                  ),
                )
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
