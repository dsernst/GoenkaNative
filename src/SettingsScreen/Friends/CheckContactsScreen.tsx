import firestore from '@react-native-firebase/firestore'
import bluebird from 'bluebird'
import _ from 'lodash'
import React, { useEffect, useReducer } from 'react'
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

  type State = {
    alreadyFriends: Contact[]
    availableToFriend: Contact[]
    notOnApp: Contact[]
    pendingRequests: Contact[]
  }

  const [{ alreadyFriends, availableToFriend, notOnApp, pendingRequests }, dispatch] = useReducer(
    (
      oldState: State,
      action: { contact: Contact; type: 'alreadyFriends' | 'availableToFriend' | 'notOnApp' | 'pendingRequests' },
    ): State => {
      const newState = _.cloneDeep(oldState)
      newState[action.type].push(action.contact)
      return newState
    },
    { alreadyFriends: [], availableToFriend: [], notOnApp: [], pendingRequests: [] },
  )

  const pendingRequestsPhones = [
    ...incomingFriendRequests.map(fr => fr.from_phone),
    ...outgoingFriendRequests.map(fr => fr.to_phone),
  ]

  const alreadyFriendsPhones = [
    ...acceptedIncomingFriendRequests.map(fr => fr.from_phone),
    ...acceptedOutgoingFriendRequests.map(fr => fr.to_phone),
  ]

  useEffect(() => {
    console.log('🔍 Searching contacts for users')
    contacts?.forEach(async contact => {
      const phoneNumbers = contact.phoneNumbers.map(pN => formatPhoneNumber(pN.number))

      if (phoneNumbers.some(n => pendingRequestsPhones.includes(n))) {
        dispatch({ contact, type: 'pendingRequests' })
      } else if (phoneNumbers.some(n => alreadyFriendsPhones.includes(n))) {
        dispatch({ contact, type: 'alreadyFriends' })
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
          dispatch({ contact, type: 'availableToFriend' })
        } else {
          dispatch({ contact, type: 'notOnApp' })
        }
      }
    })
  }, [])

  const tuple: [Contact[], string][] = [
    [availableToFriend, 'Available to Friend'],
    [alreadyFriends, 'Already Friends'],
    [pendingRequests, 'Friend Request Pending'],
    [notOnApp, 'Not On App'],
  ]

  return (
    <>
      <TitleBar name="CONTACTS" />

      <ScrollView indicatorStyle="white" style={{ paddingHorizontal: 16 }}>
        {tuple.map(
          ([array, title]) =>
            !!array.length && (
              <View key={title} style={{ marginBottom: 30 }}>
                <Text style={{ color: '#fffc', fontSize: 18, fontWeight: '600', marginBottom: 15 }}>{title}:</Text>
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
