import { FirebaseAuthTypes } from '@react-native-firebase/auth'
import React from 'react'

import { Props } from '../../reducer'
import AcceptedRequests from './AcceptedRequests'
import EnableNotificationPermissions from './EnableNotificationPermissions'
import EnterFriendPhone from './EnterFriendPhone'
import IncomingRequests from './IncomingRequests'
import OutgoingRequests from './OutgoingRequests'
import RejectedRequests from './RejectedRequests'

const Friends = (props: Props & { user: FirebaseAuthTypes.User }) => {
  const {
    acceptedIncomingFriendRequests,
    acceptedOutgoingFriendRequests,
    incomingFriendRequests,
    notifications_allowed,
    outgoingFriendRequests,
    rejectedFriendRequests,
  } = props

  if (!notifications_allowed) {
    return <EnableNotificationPermissions {...props} />
  }

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
