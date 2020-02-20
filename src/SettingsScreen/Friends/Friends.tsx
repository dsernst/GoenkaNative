import { FirebaseAuthTypes } from '@react-native-firebase/auth'
import React from 'react'

import { Props } from '../../reducer'
import EnterFriendPhone from './EnterFriendPhone'
import PendingRequests from './PendingRequests'

const Friends = (props: Props & { user: FirebaseAuthTypes.User }) => {
  const { pendingFriendRequests } = props

  return (
    <>
      <EnterFriendPhone pendingFriendRequests={pendingFriendRequests} user={props.user} />

      {!!pendingFriendRequests?.length && <PendingRequests pendingFriendRequests={pendingFriendRequests} />}
    </>
  )
}

export default Friends
