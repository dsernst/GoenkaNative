import { FirebaseAuthTypes } from '@react-native-firebase/auth'
import React from 'react'

import { Props } from '../../reducer'
import AcceptedRequests from './AcceptedRequests'
import SearchContactsButton from './CheckContactsButton'
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
      {!!incomingFriendRequests?.length && (
        <IncomingRequests displayName={displayName} incomingFriendRequests={incomingFriendRequests} />
      )}

      <SearchContactsButton {...props} />

      <EnterFriendPhone user={props.user} {...props} />

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
