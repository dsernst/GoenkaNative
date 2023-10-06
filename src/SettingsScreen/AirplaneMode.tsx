import React from 'react';
import {Platform, Switch, Text, TouchableOpacity} from 'react-native';

import {Props} from '../reducer';

function AirplaneModeSettings({airplaneModeReminder, toggle}: Props) {
  return (
    <>
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={toggle('airplaneModeReminder')}
        style={{
          alignItems: 'center',
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}>
        <Text style={{color: '#fffa', maxWidth: 220}}>
          Reminder to turn on Airplane mode at the start of sits?
        </Text>
        <Switch
          onValueChange={toggle('airplaneModeReminder')}
          style={{
            alignSelf: 'flex-end',
            paddingVertical: 10,
            transform:
              Platform.OS === 'ios' ? [{scaleX: 0.8}, {scaleY: 0.8}] : [],
          }}
          thumbColor="white"
          trackColor={{false: 'null', true: '#E58839'}}
          value={airplaneModeReminder}
        />
      </TouchableOpacity>
    </>
  );
}

export default AirplaneModeSettings;
