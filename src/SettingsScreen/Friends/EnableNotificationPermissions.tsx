import React, {useEffect} from 'react';
import {Alert, Text, TouchableOpacity, ViewStyle} from 'react-native';
import OneSignal from 'react-native-onesignal';
import Feather from 'react-native-vector-icons/Feather';

import {Props} from '../../reducer';

function EnableNotificationPermissions({
  setState,
  style,
}: Props & {style?: ViewStyle}) {
  useEffect(() => {
    OneSignal.checkPermissions(osLevelPermissions => {
      setState({notifications_allowed: !!osLevelPermissions.alert});
    });
  });

  return (
    <TouchableOpacity
      onPress={() => {
        OneSignal.promptForPushNotificationsWithUserResponse(permission => {
          if (!permission) {
            Alert.alert(
              'You blocked this app from showing Notifications.',
              'To re-enable, go to Settings.app > Notifications > GoenkaTimer.',
            );
          } else {
            setState({notifications_allowed: true});
          }
        });
      }}
      style={{
        alignItems: 'center',
        borderColor: '#fff7',
        borderRadius: 4,
        borderWidth: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 5,
        marginHorizontal: 15,
        paddingVertical: 5,
        ...style,
      }}>
      <Feather
        color="#f8ff70cc"
        name="alert-circle"
        size={18}
        style={{paddingRight: 10}}
      />
      <Text style={{color: '#fff7', fontSize: 16}}>Enable notifications</Text>
    </TouchableOpacity>
  );
}

export default EnableNotificationPermissions;
