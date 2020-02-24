import { FirebaseAuthTypes } from '@react-native-firebase/auth'
import React from 'react'

import { Props } from '../../reducer'
import AcceptedRequests from './AcceptedRequests'
import EnableNotificationPermissions from './EnableNotificationPermissions'
import EnterFriendPhone from './EnterFriendPhone'
import IncomingRequests from './IncomingRequests'
import OutgoingRequests from './OutgoingRequests'
import RejectedRequests from './RejectedRequests'
import SetDisplayName from './SetDisplayName'

const Friends = (props: Props & { user: FirebaseAuthTypes.User }) => {
  const {
    acceptedIncomingFriendRequests,
    acceptedOutgoingFriendRequests,
    displayName,
    incomingFriendRequests,
    notifications_allowed,
    outgoingFriendRequests,
    rejectedFriendRequests,
  } = props

  if (!notifications_allowed) {
    return <EnableNotificationPermissions {...props} />
  }

  if (!displayName) {
    return <SetDisplayName {...props} />
  }

  return (
    <>
      <EnterFriendPhone user={props.user} {...props} />

      {!!incomingFriendRequests?.length && (
        <IncomingRequests displayName={displayName} incomingFriendRequests={incomingFriendRequests} />
      )}
      {!!outgoingFriendRequests?.length && <OutgoingRequests outgoingFriendRequests={outgoingFriendRequests} />}
      {(!!acceptedIncomingFriendRequests?.length || !!acceptedOutgoingFriendRequests?.length) && (
        <AcceptedRequests
          acceptedIncomingFriendRequests={acceptedIncomingFriendRequests}
          acceptedOutgoingFriendRequests={acceptedOutgoingFriendRequests}
        />
      )}
      {!!rejectedFriendRequests?.length && (
        <RejectedRequests displayName={displayName} rejectedFriendRequests={rejectedFriendRequests} />
      )}
    </>
  )
}

export default Friends
