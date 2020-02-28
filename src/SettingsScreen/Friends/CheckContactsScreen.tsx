import firestore from '@react-native-firebase/firestore'
import bluebird from 'bluebird'
import React, { useEffect, useState } from 'react'
import { ActivityIndicator, ScrollView, Text, TouchableOpacity, View } from 'react-native'
import { PhoneNumber } from 'react-native-contacts'
import Ionicons from 'react-native-vector-icons/Ionicons'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'

import BackButton from '../../BackButton'
import { ContactWithType, Props } from '../../reducer'
import TitleBar from '../../TitleBar'
import { formatPhoneNumber } from './phone-helpers'
import { sendFriendRequest } from './SendRequestButton'

const CheckContactsScreen = (props: Props) => {
  const {
    acceptedIncomingFriendRequests,
    acceptedOutgoingFriendRequests,
    contacts,
    displayName,
    incomingFriendRequests,
    onesignal_id,
    outgoingFriendRequests,
    setState,
    user,
  } = props

  const pendingRequestsPhones = [
    ...incomingFriendRequests.map(fr => fr.from_phone),
    ...outgoingFriendRequests.map(fr => fr.to_phone),
  ]

  const alreadyFriendsPhones = [
    ...acceptedIncomingFriendRequests.map(fr => fr.from_phone),
    ...acceptedOutgoingFriendRequests.map(fr => fr.to_phone),
  ]

  const [, forceRender] = useState({})

  useEffect(() => {
    console.log('🔍 Searching contacts for existing friend requests')
    contacts?.forEach(async contact => {
      const phoneNumbers = contact.phoneNumbers.map(pN => formatPhoneNumber(pN.number))

      if (phoneNumbers.some(n => pendingRequestsPhones.includes(n))) {
        contact.type = 'pendingRequests'
        forceRender({})
      } else if (phoneNumbers.some(n => alreadyFriendsPhones.includes(n))) {
        contact.type = 'alreadyFriends'
        forceRender({})
      }
    })
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  if (!contacts) {
    return (
      <>
        <TitleBar name="ERROR LOADING CONTACTS" />
        <BackButton saveSpace to="SettingsScreen" />
      </>
    )
  }

  const tuple: [ContactWithType[], string][] = [
    [contacts?.filter(c => c.type === 'availableToFriend'), 'Available to Friend'],
    [contacts?.filter(c => c.type === 'alreadyFriends'), 'Already Friends'],
    [contacts?.filter(c => c.type === 'pendingRequests'), 'Friend Request Pending'],
    [contacts?.filter(c => c.type === 'notOnApp'), 'Not On App'],
    [contacts?.filter(c => !c.type), 'Unchecked'],
  ]

  // Keep friends section open when navigating Back
  setState({ expandFriendsSection: true })

  return (
    <>
      <TitleBar name="CONTACTS" style={{ marginHorizontal: 18 }} />

      <ScrollView indicatorStyle="white" style={{ paddingHorizontal: 22 }}>
        {tuple.map(
          ([array, title]) =>
            !!array.length && (
              <View key={title} style={{ marginBottom: 30 }}>
                <Text style={{ color: '#fff6', fontSize: 13, fontWeight: '600', marginBottom: 15 }}>
                  {array.length} {title}:
                </Text>

                {/* Tap to check instructions */}
                {title === 'Unchecked' && (
                  <View
                    style={{
                      borderColor: '#fff3',
                      borderRadius: 6,
                      borderWidth: 1,
                      flexDirection: 'row',
                      padding: 10,
                      position: 'absolute',
                      right: 0,
                      width: 145,
                    }}
                  >
                    <Ionicons color="#fff8" name="ios-information-circle-outline" size={16} style={{ top: 7 }} />
                    <Text style={{ color: '#fff6', fontSize: 14, fontStyle: 'italic', marginLeft: 10 }}>
                      Tap a name to check for user
                    </Text>
                  </View>
                )}

                {/* List of names */}
                {array
                  .sort((a, b) => new Intl.Collator().compare(a.givenName, b.givenName))
                  .map((contact, index) => (
                    // {/* Contact row */}
                    <TouchableOpacity
                      disabled={!(!contact.type || contact.type === 'notOnApp')}
                      key={index}
                      onPress={() => {
                        contact.checking = true
                        lookupContacts([contact])
                        forceRender({})
                      }}
                      style={{ marginBottom: 15 }}
                    >
                      {/* Contact name */}
                      <Text style={{ color: '#fffc', fontSize: 18 }}>
                        {contact.checking && <ActivityIndicator style={{ paddingRight: 10 }} />}
                        {contact.givenName} {contact.familyName}
                      </Text>

                      {/* Phone number (only shown if onApp) */}
                      {title === 'Available to Friend' &&
                        contact.phoneNumbers.map((pN: PhoneNumber, index2) => (
                          <View
                            key={index2}
                            style={{
                              alignItems: 'center',
                              flexDirection: 'row',
                              justifyContent: 'space-between',
                              marginTop: 3,
                            }}
                          >
                            <Text style={{ color: '#fff8' }}>{pN.number}</Text>

                            {/* Send Request btn */}
                            {pN.foundUser && (
                              <TouchableOpacity
                                onPress={async () => {
                                  await sendFriendRequest({
                                    displayName,
                                    onesignal_id,
                                    potentialFriend: pN.foundUser!,
                                    user,
                                  })
                                  contact.type = 'pendingRequests'
                                  forceRender({})
                                }}
                                style={{
                                  alignItems: 'center',
                                  borderColor: '#fff7',
                                  borderRadius: 6,
                                  borderWidth: 1,
                                  flexDirection: 'row',
                                  padding: 4,
                                  paddingHorizontal: 11,
                                }}
                              >
                                <MaterialIcons
                                  color="#fffa"
                                  name="person-add"
                                  size={15}
                                  style={{ paddingRight: 7, top: 1 }}
                                />
                                <Text style={{ color: '#fffb' }}>Send Request</Text>
                              </TouchableOpacity>
                            )}
                          </View>
                        ))}
                    </TouchableOpacity>
                  ))}
              </View>
            ),
        )}
      </ScrollView>

      <BackButton saveSpace to="SettingsScreen" />
    </>
  )

  function lookupContacts(contactsToLookup: ContactWithType[]) {
    contactsToLookup.forEach(async contact => {
      const phoneNumbers = contact.phoneNumbers.map(pN => formatPhoneNumber(pN.number))

      const dbResults = await bluebird.map(
        phoneNumbers,
        async phoneNumber =>
          await firestore()
            .collection('users')
            .doc(phoneNumber)
            .get(),
      )
      if (dbResults.some(doc => doc.exists)) {
        contact.type = 'availableToFriend'
        dbResults.forEach((doc, index) => {
          if (doc.exists) {
            // @ts-ignore: doesn't know doc.data() type
            contact.phoneNumbers[index].foundUser = { id: doc.id, ...doc.data() }
          }
        })
      } else {
        contact.type = 'notOnApp'
      }
      contact.checking = false
      forceRender({})
    })
  }
}
CheckContactsScreen.paddingHorizontal = 2

export default CheckContactsScreen
