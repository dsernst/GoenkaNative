import React from 'react'
import { Text, View, ViewStyle } from 'react-native'

import { version } from '../package.json'

export default (props: { name: string; showVersion?: boolean; style?: ViewStyle }) => (
  <View
    style={[
      {
        borderBottomWidth: 1,
        borderColor: '#fff3',
        borderTopWidth: 1,
        marginVertical: 20,
        paddingVertical: 7,
      },
      props.style || {},
    ]}
  >
    <Text
      style={{
        alignSelf: 'center',
        color: '#fffc',
        fontSize: 11,
        fontWeight: '500',
      }}
    >
      {props.name}
    </Text>
    {props.showVersion && (
      <Text style={{ color: '#fff3', fontSize: 11, position: 'absolute', right: 0, top: 7 }}>v{version}</Text>
    )}
  </View>
)
