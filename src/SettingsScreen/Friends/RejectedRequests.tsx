import React from 'react';
import {Text, TouchableOpacity, View} from 'react-native';

import {FriendRequest} from '../../reducer';
import {acceptRequest} from './IncomingRequests';
import {prettyDisplayPhone} from './phone-helpers';

function RejectedRequests({
  displayName,
  rejectedFriendRequests,
}: {
  displayName: string;
  rejectedFriendRequests: FriendRequest[];
}) {
  return (
    <>
      <Text style={{color: '#fff7', fontWeight: '600', marginTop: 30}}>
        Rejected:
      </Text>
      {rejectedFriendRequests?.map(request => (
        <View
          key={request.id}
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginTop: 15,
          }}>
          <View style={{maxWidth: 200}}>
            <Text style={{color: '#fffb'}}>{request.from_name}</Text>
            <Text style={{color: '#fff5'}}>
              {prettyDisplayPhone(request.from_phone)}
            </Text>
          </View>
          <View style={{alignItems: 'center', flexDirection: 'row'}}>
            <TouchableOpacity
              onPress={acceptRequest(request, displayName)}
              style={{marginLeft: 30}}>
              <Text style={{color: '#9CDCFEee'}}>✓ Accept</Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}
    </>
  );
}

export default RejectedRequests;
