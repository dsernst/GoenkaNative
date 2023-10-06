import firestore from '@react-native-firebase/firestore';
import React from 'react';
import {
  Alert,
  Platform,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import {FriendRequest} from '../../reducer';
import {prettyDisplayPhone} from './phone-helpers';

function AcceptedRequests({
  acceptedIncomingFriendRequests,
  acceptedOutgoingFriendRequests,
}: {
  acceptedIncomingFriendRequests: FriendRequest[];
  acceptedOutgoingFriendRequests: FriendRequest[];
}) {
  // Merge incoming & outgoing friend requests
  const allRequests: {
    name: string;
    phone: string;
    request: FriendRequest;
    toggle_notifs: object;
    wants_notifs: boolean;
  }[] = [
    ...acceptedIncomingFriendRequests.map(iFR => ({
      name: iFR.from_name,
      phone: iFR.from_phone,
      request: iFR,
      toggle_notifs: {to_wants_notifs: !iFR.to_wants_notifs},
      wants_notifs: iFR.to_wants_notifs,
    })),
    ...acceptedOutgoingFriendRequests.map(oFR => ({
      name: oFR.to_name,
      phone: oFR.to_phone,
      request: oFR,
      toggle_notifs: {from_wants_notifs: !oFR.from_wants_notifs},
      wants_notifs: oFR.from_wants_notifs,
    })),
  ].sort((a, b) => new Intl.Collator().compare(a.name, b.name));

  return (
    <>
      <Text style={{color: '#fff4', fontWeight: '600', marginTop: 30}}>
        Accepted:
      </Text>
      {allRequests.map(
        ({name, phone, request, toggle_notifs, wants_notifs}) => (
          <View
            key={request.id}
            style={{
              flexDirection: 'row',
              marginTop: 15,
              opacity: wants_notifs ? 1 : 0.3,
            }}>
            <TouchableOpacity
              onPress={() =>
                Alert.alert(
                  `Unfriend ${name}?`,
                  'Are you sure? This will stop them from seeing your notifications as well.',
                  [
                    {text: 'Cancel'},
                    {
                      onPress: () =>
                        firestore()
                          .collection('friendRequests')
                          .doc(request.id)
                          .delete(),
                      style: 'destructive',
                      text: 'Unfriend',
                    },
                  ],
                )
              }>
              <Text style={{color: '#ff5e5eee'}}>&nbsp; ✗&nbsp; </Text>
            </TouchableOpacity>
            <View style={{marginLeft: 5}}>
              <Text style={{color: '#fffb'}}>&nbsp; {name}</Text>
              <Text style={{color: '#fff5'}}>
                &nbsp; {prettyDisplayPhone(phone)}
              </Text>
            </View>
            <Switch
              onValueChange={() =>
                firestore()
                  .collection('friendRequests')
                  .doc(request.id)
                  .update(toggle_notifs)
              }
              style={{
                alignSelf: 'flex-end',
                marginLeft: 'auto',
                paddingVertical: 10,
                transform:
                  Platform.OS === 'ios' ? [{scaleX: 0.8}, {scaleY: 0.8}] : [],
              }}
              thumbColor="white"
              trackColor={{false: 'null', true: 'rgb(10, 132, 255)'}}
              value={wants_notifs}
            />
          </View>
        ),
      )}
    </>
  );
}

export default AcceptedRequests;
