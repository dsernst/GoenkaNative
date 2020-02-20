import { FirebaseAuthTypes } from '@react-native-firebase/auth'
import React from 'react'

import { Props } from '../../reducer'
import EnterFriendPhone from './EnterFriendPhone'
import IncomingRequests from './IncomingRequests'
import OutgoingRequests from './OutgoingRequests'

const Friends = (props: Props & { user: FirebaseAuthTypes.User }) => {
  const { incomingFriendRequests, outgoingFriendRequests } = props

  return (
    <>
      <EnterFriendPhone outgoingFriendRequests={outgoingFriendRequests} user={props.user} />

      {!!outgoingFriendRequests?.length && <OutgoingRequests outgoingFriendRequests={outgoingFriendRequests} />}

      {!!incomingFriendRequests?.length && <IncomingRequests incomingFriendRequests={incomingFriendRequests} />}
    </>
  )
}

export default Friends
