import firestore from '@react-native-firebase/firestore';
import React from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import OneSignal from 'react-native-onesignal';

import {FriendRequest} from '../../reducer';
import {prettyDisplayPhone} from './phone-helpers';

function IncomingRequests({
  displayName,
  incomingFriendRequests,
}: {
  displayName: string;
  incomingFriendRequests: FriendRequest[];
}) {
  return (
    <View style={{marginBottom: 50}}>
      <Text style={{color: '#fffa', fontWeight: '600'}}>
        <Text style={{color: '#DCDC33dd'}}>
          {incomingFriendRequests.length}
        </Text>
        &nbsp; New Friend Request
        {incomingFriendRequests.length > 1 ? 's' : ''}:
      </Text>
      {incomingFriendRequests?.map(request => (
        <View
          key={request.id}
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginTop: 15,
          }}>
          <View style={{maxWidth: 140}}>
            <Text style={{color: '#fffc'}}>{request.from_name}</Text>
            <Text style={{color: '#fff5'}}>
              {prettyDisplayPhone(request.from_phone)}
            </Text>
          </View>
          <View style={{alignItems: 'center', flexDirection: 'row'}}>
            <TouchableOpacity
              onPress={() =>
                firestore()
                  .collection('friendRequests')
                  .doc(request.id)
                  .update({rejected: new Date()})
              }>
              <Text style={{color: '#ff5e5eee'}}>✗&nbsp; Reject</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={acceptRequest(request, displayName)}
              style={{marginLeft: 30}}>
              <Text style={{color: '#9CDCFEee'}}>✓ Accept</Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}
    </View>
  );
}

export default IncomingRequests;

export function acceptRequest(request: FriendRequest, displayName: string) {
  return () => {
    firestore().collection('friendRequests').doc(request.id).update({
      accepted: new Date(),
      from_wants_notifs: true,
      to_name: displayName,
      to_wants_notifs: true,
    });

    OneSignal.postNotification(
      {
        en: `${displayName} (${prettyDisplayPhone(
          request.to_phone!,
        )}) accepted your friend request :)`,
      },
      {},
      [request.from_onesignal_id],
    );
  };
}
