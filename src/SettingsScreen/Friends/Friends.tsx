import { FirebaseAuthTypes } from '@react-native-firebase/auth'
import React from 'react'

import { Props } from '../../reducer'
import AcceptedRequests from './AcceptedRequests'
import EnterFriendPhone from './EnterFriendPhone'
import IncomingRequests from './IncomingRequests'
import OutgoingRequests from './OutgoingRequests'
import RejectedRequests from './RejectedRequests'

const Friends = (props: Props & { user: FirebaseAuthTypes.User }) => {
  const {
    acceptedIncomingFriendRequests,
    acceptedOutgoingFriendRequests,
    incomingFriendRequests,
    outgoingFriendRequests,
    rejectedFriendRequests,
  } = props

  return (
    <>
      <EnterFriendPhone outgoingFriendRequests={outgoingFriendRequests} user={props.user} />

      {!!incomingFriendRequests?.length && <IncomingRequests incomingFriendRequests={incomingFriendRequests} />}
      {!!outgoingFriendRequests?.length && <OutgoingRequests outgoingFriendRequests={outgoingFriendRequests} />}
      {(!!acceptedIncomingFriendRequests?.length || !!acceptedOutgoingFriendRequests?.length) && (
        <AcceptedRequests
          acceptedIncomingFriendRequests={acceptedIncomingFriendRequests}
          acceptedOutgoingFriendRequests={acceptedOutgoingFriendRequests}
        />
      )}
      {!!rejectedFriendRequests?.length && <RejectedRequests rejectedFriendRequests={rejectedFriendRequests} />}
    </>
  )
}

export default Friends
