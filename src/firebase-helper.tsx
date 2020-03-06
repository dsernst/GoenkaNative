import auth from '@react-native-firebase/auth'
import firestore from '@react-native-firebase/firestore'
import bluebird from 'bluebird'

import { ContactDoc, FriendRequest, RecentlyJoinedContact, setStatePayload } from './reducer'

function init(setState: (payload: setStatePayload) => void) {
  let unsubscribeFromOnlineSits: (() => void) | undefined
  let unsubscribeFromOutgoingFriendRequests: (() => void) | undefined
  let unsubscribeFromIncomingFriendRequests: (() => void) | undefined
  let unsubscribeFromRecentlyJoinedContacts: (() => void) | undefined

  const unsubscribeFromAuth = auth().onAuthStateChanged(user => {
    console.log('🛂 auth state changed:', user)
    setState({ user })

    // If no user, cancel existing subscriptions
    if (!user) {
      return unsubscribeFromData()
    }

    // If logged in, subscribe to user's sits & friend requests
    console.log('Subscribing to onlineSits')
    unsubscribeFromOnlineSits = firestore()
      .collection('sits')
      .where('user_id', '==', user.uid)
      .orderBy('date', 'desc')
      .onSnapshot(results => {
        if (!results) {
          return console.log('🚫 db snapshot: no results for onlineSits')
        }
        console.log('⬇️  db snapshot: onlineSits')
        setState({
          onlineSits: results.docs
            // @ts-ignore: doc.data() has imprecise typing so manually specifying instead
            .map((doc): { date: FirebaseFirestoreTypes.Timestamp } & OnlineSit => ({ id: doc.id, ...doc.data() }))

            // Convert Firebase Timestamp to normal js Date
            .map(d => ({ ...d, date: d.date.toDate() })),
        })
      })

    console.log('Subscribing to outgoingFriendRequests')
    unsubscribeFromOutgoingFriendRequests = firestore()
      .collection('friendRequests')
      .where('from_phone', '==', user.phoneNumber)
      .onSnapshot(results => {
        if (!results) {
          return console.log('🚫 db snapshot: no results for outgoingFriendRequests')
        }
        console.log('⬇️  db snapshot: outgoingFriendRequests')

        const outgoingFriendRequests: FriendRequest[] = []
        const acceptedOutgoingFriendRequests: FriendRequest[] = []

        results.docs.forEach(doc => {
          // @ts-ignore: doc.data() has imprecise typing so manually specifying instead
          const request: FriendRequest = { id: doc.id, ...doc.data() }
          if (request.accepted) {
            acceptedOutgoingFriendRequests.push(request)
          } else {
            outgoingFriendRequests.push(request)
          }
        })

        setState({
          acceptedOutgoingFriendRequests,
          outgoingFriendRequests,
        })
      })

    console.log('Subscribing to incomingFriendRequests')
    unsubscribeFromIncomingFriendRequests = firestore()
      .collection('friendRequests')
      .where('to_phone', '==', user.phoneNumber)
      .onSnapshot(results => {
        if (!results) {
          return console.log('🚫 db snapshot: no results for incomingFriendRequests')
        }
        console.log('⬇️  db snapshot: incomingFriendRequests')
        const incomingFriendRequests: FriendRequest[] = []
        const acceptedIncomingFriendRequests: FriendRequest[] = []
        const rejectedFriendRequests: FriendRequest[] = []

        results.docs.forEach(doc => {
          // @ts-ignore: doc.data() has imprecise typing so manually specifying instead
          const request: FriendRequest = { id: doc.id, ...doc.data() }
          if (request.accepted) {
            acceptedIncomingFriendRequests.push(request)
          } else if (request.rejected) {
            rejectedFriendRequests.push(request)
          } else {
            incomingFriendRequests.push(request)
          }
        })

        setState({
          acceptedIncomingFriendRequests,
          incomingFriendRequests,
          rejectedFriendRequests,
        })
      })

    console.log('Subscribing to recentlyJoinedContacts')
    unsubscribeFromRecentlyJoinedContacts = firestore()
      .collection('users')
      .doc(user.phoneNumber!)
      .collection('contactsNotOnApp')
      .onSnapshot(async results => {
        if (!results) {
          return console.log('🚫 db snapshot: no results for recentlyJoinedContacts')
        }
        console.log('⬇️  db snapshot: recentlyJoinedContacts')

        const recentlyJoinedContacts: RecentlyJoinedContact[] = []
        const contactsNotOnApp: ContactDoc[] = []

        await bluebird.map(results.docs, async doc => {
          // @ts-ignore: doc.data() has imprecise typing so manually specifying instead
          const record: ContactDoc = { id: doc.id, ...doc.data() }

          if (!record.signed_up) {
            return contactsNotOnApp.push(record)
          }

          return await firestore()
            .collection('users')
            .doc(record.phoneNumber)
            .get()
            .then(userDoc =>
              recentlyJoinedContacts.push({
                ...record,
                new_name: userDoc.data()?.name,
                new_onesignal_id: userDoc.data()?.onesignal_id,
              }),
            )
        })

        setState({
          contactsNotOnApp,
          recentlyJoinedContacts,
        })
      })
  })

  return () => {
    unsubscribeFromData()
    unsubscribeFromAuth()
  }

  function unsubscribeFromData() {
    if (unsubscribeFromOnlineSits) {
      console.log('Unsubscribing from onlineSits')
      unsubscribeFromOnlineSits()
      unsubscribeFromOnlineSits = undefined
    }
    if (unsubscribeFromOutgoingFriendRequests) {
      console.log('Unsubscribing from outgoingFriendRequests')
      unsubscribeFromOutgoingFriendRequests()
      unsubscribeFromOutgoingFriendRequests = undefined
    }
    if (unsubscribeFromIncomingFriendRequests) {
      console.log('Unsubscribing from incomingFriendRequests')
      unsubscribeFromIncomingFriendRequests()
      unsubscribeFromIncomingFriendRequests = undefined
    }
    if (unsubscribeFromRecentlyJoinedContacts) {
      console.log('Unsubscribing from recentlyJoinedContacts')
      unsubscribeFromRecentlyJoinedContacts()
      unsubscribeFromRecentlyJoinedContacts = undefined
    }
  }
}

export default { init }
