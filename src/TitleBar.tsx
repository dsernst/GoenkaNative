import React from 'react'
import { Text, View, ViewStyle } from 'react-native'

import { version } from '../package.json'

export default (props: { name: string; showVersion?: boolean; style?: ViewStyle }) => (
  <View
    style={[
      {
        backgroundColor: '#40514718',
        borderColor: '#40514758',
        borderTopWidth: 1,
        marginBottom: 20,
        marginTop: 4,
        paddingVertical: 10,
      },
      props.style || {},
    ]}
  >
    <Text
      style={{
        alignSelf: 'center',
        color: '#fffa',
        fontSize: 11,
        fontWeight: '500',
      }}
    >
      {props.name}
    </Text>
    {props.showVersion && (
      <Text style={{ color: '#fff3', fontSize: 11, position: 'absolute', right: 29, top: 10 }}>v{version}</Text>
    )}
  </View>
)
