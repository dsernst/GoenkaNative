import React, { useRef } from 'react'
import { Text, TextInput, TouchableOpacity } from 'react-native'

import { Props } from '../../reducer'
import EnterFriendPhone from './EnterFriendPhone'
import PendingRequests from './PendingRequests'

const Friends = (props: Props) => {
  const { pendingFriendRequests } = props
  const textInput = useRef<TextInput>(null)

  console.log({ pendingFriendRequests })

  return (
    <TouchableOpacity activeOpacity={1} onPress={() => textInput.current?.blur()} style={{ flex: 1 }}>
      <Text
        style={{
          color: '#fff9',
          fontSize: 17,
        }}
      >
        Add friend by phone number:
      </Text>

      <EnterFriendPhone pendingFriendRequests={pendingFriendRequests} textInput={textInput} user={props.user} />

      {!!pendingFriendRequests?.length && <PendingRequests pendingFriendRequests={pendingFriendRequests} />}
    </TouchableOpacity>
  )
}

export default Friends
