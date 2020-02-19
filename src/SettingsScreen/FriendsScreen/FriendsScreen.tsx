import React from 'react'
import { Text } from 'react-native'

import BackButton from '../../BackButton'
import TitleBar from '../../TitleBar'
import EnterFriendPhone from './EnterFriendPhone'

const FriendsScreen = () => {
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

      <EnterFriendPhone />

      <BackButton to="SettingsScreen" />
    </>
  )
}

export default FriendsScreen
