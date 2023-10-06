import firestore from '@react-native-firebase/firestore';
import React, {useState} from 'react';
import {Text, TextInput, TouchableOpacity, View} from 'react-native';
import OneSignal from 'react-native-onesignal';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';

import {Props} from '../../reducer';

function SetDisplayName({
  acceptedIncomingFriendRequests,
  acceptedOutgoingFriendRequests,
  backgroundColor,
  incomingFriendRequests,
  noBorder,
  onesignal_id,
  outgoingFriendRequests,
  rejectedFriendRequests,
  setState,
  user,
}: Props & {noBorder?: boolean}) {
  const [name, setName] = useState('');

  return (
    <View
      style={{
        borderColor: '#f8ff7044',
        borderRadius: 8,
        borderWidth: noBorder ? 0 : 1,
        padding: noBorder ? 0 : 10,
      }}>
      <Text
        style={{
          alignSelf: 'center',
          backgroundColor,
          color: '#fff7',
          opacity: noBorder ? 0 : 1,
          paddingHorizontal: 10,
          position: 'absolute',
          top: -9,
        }}>
        <FontAwesome color="#f8ff7099" name="user" size={15} />
        &nbsp; Set Display Name
      </Text>

      <Text style={{color: '#fffb', marginTop: 15}}>
        How can other people recognize you?
      </Text>

      <View style={{flexDirection: 'row', marginTop: 10}}>
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
            setState({displayName: name});
            firestore()
              .collection('users')
              .doc(user!.phoneNumber!)
              .set({name, onesignal_id});
            lookupFriendsAwaitingMySignup();
            updateFriendRequests();
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
          }}>
          <Ionicons
            color="#fffa"
            name="ios-save"
            size={15}
            style={{paddingRight: 12, paddingTop: 1}}
          />
          <Text style={{color: '#fff9', fontSize: 16, fontWeight: '500'}}>
            Set
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  function lookupFriendsAwaitingMySignup() {
    console.log(
      'Looking for contactsNotOnApp docs about me:',
      user!.phoneNumber,
    );
    firestore()
      .collectionGroup('contactsNotOnApp')
      .where('phoneNumber', '==', user!.phoneNumber)
      .get()
      .then(results => {
        if (!results) {
          return console.warn('🚫 db: problem getting contactsNotOnApp');
        }
        results.docs.forEach(async doc => {
          const parent = (await doc!.ref!.parent!.parent!.get()).data();
          const data = doc.data();

          if (data.signed_up) {
            return; // Don't send multiple notifications
          }

          doc.ref.update({signed_up: new Date()});
          const notification = JSON.stringify({
            contents: {
              en: `Your contact ${data.name} just registered. Go send them a friend request!`,
            },
            included_segments: [parent!.onesignal_id],
          });
          OneSignal.postNotification(notification);
          // OneSignal.postNotification(
          //   {
          //     en: `Your contact ${data.name} just registered. Go send them a friend request!`,
          //   },
          //   {},
          //   [parent!.onesignal_id],
          // );
        });
      });
  }
  function updateFriendRequests() {
    console.log('Updating friend requests');
    [
      acceptedIncomingFriendRequests,
      incomingFriendRequests,
      rejectedFriendRequests,
    ].forEach(arr =>
      arr.forEach(fr =>
        firestore()
          .collection('friendRequests')
          .doc(fr.id)
          .update({to_name: name}),
      ),
    );
    [acceptedOutgoingFriendRequests, outgoingFriendRequests].forEach(arr =>
      arr.forEach(fr =>
        firestore()
          .collection('friendRequests')
          .doc(fr.id)
          .update({from_name: name}),
      ),
    );
  }
}

export default SetDisplayName;
