import firestore from '@react-native-firebase/firestore'
import bluebird from 'bluebird'
import React, { useState } from 'react'
import { ActivityIndicator, SectionList, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { PhoneNumber } from 'react-native-contacts'
import EvilIcons from 'react-native-vector-icons/EvilIcons'
import Ionicons from 'react-native-vector-icons/Ionicons'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'

import BackButton from '../../BackButton'
import { ContactWithType, Props } from '../../reducer'
import TitleBar from '../../TitleBar'
import { formatPhoneNumber } from './phone-helpers'
import { sendFriendRequest } from './SendRequestButton'

const CheckContactsScreen = (props: Props) => {
  const { backgroundColor, contacts, displayName, onesignal_id, setState, user } = props

  const [filter, setFilter] = useState('')

  const [, forceRender] = useState({})

  if (!contacts) {
    return (
      <>
        <TitleBar name="ERROR LOADING CONTACTS" />
        <BackButton saveSpace to="SettingsScreen" />
      </>
    )
  }

  const filteredContacts = (type?: string) =>
    contacts
      .filter(
        c =>
          filter === '' ||
          c.givenName.toLowerCase().includes(filter.toLowerCase()) ||
          c.familyName.toLowerCase().includes(filter.toLowerCase()),
      )
      .filter(c => c.type === type)

  const allData: { data: ContactWithType[]; title: string }[] = [
    { data: filteredContacts('availableToFriend'), title: 'Available to Friend' },
    { data: filteredContacts('alreadyFriends'), title: 'Already Friends' },
    { data: filteredContacts('pendingRequests'), title: 'Friend Request Pending' },
    { data: filteredContacts('notOnApp'), title: 'Not On App' },
    { data: filteredContacts(), title: 'Unchecked' },
  ].map(s => ({
    ...s,
    data: s.data.sort((a, b) => new Intl.Collator().compare(a.givenName, b.givenName)),
  }))

  // Keep friends section open when navigating Back
  setState({ expandFriendsSection: true })

  return (
    <>
      <TitleBar name="CONTACTS" style={{ marginBottom: 1, marginHorizontal: 18 }} />

      <View>
        <TextInput
          autoCorrect={false}
          clearButtonMode="always"
          onChangeText={setFilter}
          placeholder="Filter"
          placeholderTextColor="#fff5"
          returnKeyType="done"
          style={{
            backgroundColor: '#353d38',
            borderRadius: 7,
            color: '#fffd',
            fontSize: 18,
            marginHorizontal: 18,
            marginVertical: 10,
            padding: 10,
            paddingLeft: 35,
          }}
          value={filter}
        />
        <EvilIcons color="#fff8" name="search" size={20} style={{ left: 26, position: 'absolute', top: 23 }} />
      </View>

      <SectionList
        indicatorStyle="white"
        keyExtractor={item => item.recordID}
        renderItem={({ item: contact }) => {
          return (
            // {/* Contact row */}
            <TouchableOpacity
              disabled={!(!contact.type || contact.type === 'notOnApp')}
              onPress={() => {
                contact.checking = true
                lookupContacts([contact])
                forceRender({})
              }}
              style={{ marginBottom: 5, marginHorizontal: 22, marginTop: 15 }}
            >
              {/* Contact name */}
              <Text style={{ color: '#fffc', fontSize: 18 }}>
                {contact.checking && <ActivityIndicator style={{ height: 18, paddingRight: 40, width: 30 }} />}
                {contact.givenName} {contact.familyName}
                {!contact.givenName && !contact.familyName && (
                  // show number if no name
                  <Text style={{ opacity: 0.6 }}>{contact.phoneNumbers[0]?.number}</Text>
                )}
              </Text>

              {/* Phone number (only shown if onApp) */}
              {contact.type === 'availableToFriend' &&
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
                            from_name: displayName!,
                            from_onesignal_id: onesignal_id!,
                            from_phone: user!.phoneNumber!,
                            to_name: pN.foundUser!.name,
                            to_onesignal_id: pN.foundUser!.onesignal_id,
                            to_phone: pN.number,
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
                        <MaterialIcons color="#fffa" name="person-add" size={15} style={{ paddingRight: 7, top: 1 }} />
                        <Text style={{ color: '#fffb' }}>Send Request</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                ))}
            </TouchableOpacity>
          )
        }}
        renderSectionFooter={({ section }) => <View style={{ height: section.data.length ? 30 : 0 }} />}
        renderSectionHeader={({ section }) => {
          const { data, title } = section
          if (!data.length) {
            return <></>
          }

          return (
            <View key={title} style={{ backgroundColor: '#001207' }}>
              <Text
                style={{ color: '#fff6', fontSize: 13, fontWeight: '600', marginVertical: 7, paddingHorizontal: 20 }}
              >
                {data.length} {title}:
              </Text>

              {/* Tap to check instructions */}
              {title === 'Unchecked' && (
                <View
                  style={{
                    backgroundColor,
                    borderColor: '#fff3',
                    borderRadius: 6,
                    borderWidth: 1,
                    flexDirection: 'row',
                    padding: 10,
                    position: 'absolute',
                    right: 10,
                    top: 40,
                    width: 145,
                  }}
                >
                  <Ionicons color="#fff8" name="ios-information-circle-outline" size={16} style={{ top: 7 }} />
                  <Text style={{ color: '#fff6', fontSize: 14, fontStyle: 'italic', marginLeft: 10 }}>
                    Tap a name to check for user
                  </Text>
                </View>
              )}
            </View>
          )
        }}
        sections={allData}
      />

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
        phoneNumbers.forEach(pN =>
          firestore()
            .collection('users')
            .doc(user!.phoneNumber!)
            .collection('contactsNotOnApp')
            .doc(pN)
            .set({ created_at: new Date(), name: `${contact.givenName} ${contact.familyName}`, phoneNumber: pN }),
        )
      }
      contact.checking = false
      forceRender({})
    })
  }
}
CheckContactsScreen.paddingHorizontal = 2

export default CheckContactsScreen
