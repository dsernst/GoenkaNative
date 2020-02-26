import firestore from '@react-native-firebase/firestore'
import bluebird from 'bluebird'
import React, { useEffect, useState } from 'react'
import { ScrollView, Text, View } from 'react-native'
import { Contact } from 'react-native-contacts'

import BackButton from '../../BackButton'
import { Props } from '../../reducer'
import TitleBar from '../../TitleBar'
import { formatPhoneNumber } from './phone-helpers'

function CheckContactsScreen(props: Props) {
  const {
    acceptedIncomingFriendRequests,
    acceptedOutgoingFriendRequests,
    contacts,
    incomingFriendRequests,
    outgoingFriendRequests,
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
    console.log('🔍 Searching contacts for users')
    contacts?.forEach(async contact => {
      const phoneNumbers = contact.phoneNumbers.map(pN => formatPhoneNumber(pN.number))

      if (phoneNumbers.some(n => pendingRequestsPhones.includes(n))) {
        contact.type = 'pendingRequests'
        forceRender({})
      } else if (phoneNumbers.some(n => alreadyFriendsPhones.includes(n))) {
        contact.type = 'alreadyFriends'
        forceRender({})
      } else {
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
          forceRender({})
        } else {
          contact.type = 'notOnApp'
          forceRender({})
        }
      }
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (!contacts) {
    return (
      <>
        <TitleBar name="ERROR LOADING CONTACTS" />
        <BackButton saveSpace to="SettingsScreen" />
      </>
    )
  }

  const tuple: [Contact[], string][] = [
    [contacts?.filter(c => c.type === 'availableToFriend'), 'Available to Friend'],
    [contacts?.filter(c => c.type === 'alreadyFriends'), 'Already Friends'],
    [contacts?.filter(c => c.type === 'pendingRequests'), 'Friend Request Pending'],
    [contacts?.filter(c => c.type === 'notOnApp'), 'Not On App'],
  ]

  return (
    <>
      <TitleBar name="CONTACTS" />

      <ScrollView indicatorStyle="white" style={{ paddingHorizontal: 16 }}>
        {tuple.map(
          ([array, title]) =>
            !!array.length && (
              <View key={title} style={{ marginBottom: 30 }}>
                <Text style={{ color: '#fff6', fontSize: 13, fontWeight: '600', marginBottom: 15 }}>{title}:</Text>
                {array
                  .sort((a, b) => new Intl.Collator().compare(a.familyName, b.familyName))
                  .map((contact, index) => (
                    <Text key={index} style={{ color: '#fffc', fontSize: 18, marginBottom: 15 }}>
                      {contact.givenName} {contact.familyName}
                    </Text>
                  ))}
              </View>
            ),
        )}
      </ScrollView>

      <BackButton saveSpace to="SettingsScreen" />
    </>
  )
}

export default CheckContactsScreen
