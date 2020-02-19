import React from 'react'
import { Text } from 'react-native'

import BackButton from '../../BackButton'
import { Props } from '../../reducer'
import TitleBar from '../../TitleBar'
import EnterFriendPhone from './EnterFriendPhone'

const FriendsScreen = (props: Props) => {
  return (
    <>
      <TitleBar name="FRIEND NOTIFICATIONS" />

      <Text
        style={{
          color: '#fff9',
          fontSize: 18,
          fontWeight: '600',
          marginTop: 14,
        }}
      >
        Add Friends
      </Text>

      {props.user ? <EnterFriendPhone user={props.user} /> : <Text style={{ color: '#fffa' }}>Not logged in</Text>}

      <BackButton to="SettingsScreen" />
    </>
  )
}

export default FriendsScreen
