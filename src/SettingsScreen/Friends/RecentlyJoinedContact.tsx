import firestore from '@react-native-firebase/firestore';
import React, {useState} from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import {Props, RecentlyJoinedContact as RJC} from '../../reducer';
import {sendFriendRequest} from './SendRequestButton';

type RecentlyJoinedContactProps = Props & {
  recentlyJoinedContact: RJC;
};
function RecentlyJoinedContact({
  displayName,
  onesignal_id,
  recentlyJoinedContact,
  user,
}: RecentlyJoinedContactProps) {
  const [error, setError] = useState();
  const [submitting, setSubmitting] = useState(false);

  return (
    <View style={{marginBottom: 30}}>
      <Text style={{color: '#fffa'}}>
        Your contact{' '}
        <Text style={{color: '#fffc', fontWeight: '700'}}>
          {recentlyJoinedContact.name}
        </Text>{' '}
        signed up as{' '}
        <Text style={{color: '#f8ff70', fontWeight: '700'}}>
          {recentlyJoinedContact.new_name}
        </Text>
        !
      </Text>

      <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() =>
            firestore()
              .collection('users')
              .doc(user!.phoneNumber!)
              .collection('contactsNotOnApp')
              .doc(recentlyJoinedContact.phoneNumber)
              .delete()
          }
          style={{
            alignItems: 'center',
            borderColor: '#fff4',
            borderRadius: 6,
            borderWidth: 1,
            flexDirection: 'row',
            justifyContent: 'center',
            marginRight: 15,
            marginTop: 15,
            paddingHorizontal: 15,
            paddingVertical: 7,
          }}>
          <Text style={{color: '#fff6', fontSize: 13, fontWeight: '600'}}>
            Ignore
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.7}
          onPress={submit}
          style={{
            alignItems: 'center',
            borderColor: '#fff4',
            borderRadius: 8,
            borderWidth: 1,
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'center',
            marginTop: 15,
            paddingHorizontal: 15,
            paddingVertical: 7,
          }}>
          <MaterialIcons
            color="#fffa"
            name="person-add"
            size={20}
            style={{paddingLeft: 4, paddingRight: 8, paddingTop: 2}}
          />
          <Text style={{color: '#fff9', fontSize: 13, fontWeight: '600'}}>
            Send Friend Request
          </Text>
        </TouchableOpacity>
      </View>

      {submitting && (
        <Text
          style={{
            color: '#fff9',
            marginTop: 14,
          }}>
          Sending...
        </Text>
      )}

      {error && (
        <Text
          style={{
            color: '#ff5e5e',
            marginTop: 14,
          }}>
          {error}
        </Text>
      )}
    </View>
  );

  async function submit() {
    setError(undefined);
    setSubmitting(true);
    try {
      await sendFriendRequest({
        from_name: displayName!,
        from_onesignal_id: onesignal_id!,
        from_phone: user!.phoneNumber!,
        to_name: recentlyJoinedContact.new_name,
        to_onesignal_id: recentlyJoinedContact.new_onesignal_id,
        to_phone: recentlyJoinedContact.phoneNumber,
      });
      await firestore()
        .collection('users')
        .doc(user!.phoneNumber!)
        .collection('contactsNotOnApp')
        .doc(recentlyJoinedContact.phoneNumber)
        .delete();
    } catch (err: any) {
      return setError(err.toString());
    }
  }
}

export default RecentlyJoinedContact;
