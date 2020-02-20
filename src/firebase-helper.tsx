import { firebase } from '@react-native-firebase/auth'
import firestore from '@react-native-firebase/firestore'

import { PendingFriendRequest, setStatePayload } from './reducer'

function init(setState: (payload: setStatePayload) => void) {
  let unsubscribeFromOnlineSits: (() => void) | undefined
  let unsubscribeFromOutgoingFriendRequests: (() => void) | undefined
  let unsubscribeFromIncomingFriendRequests: (() => void) | undefined
  const unsubscribeFromAuth = firebase.auth().onAuthStateChanged(user => {
    console.log('auth state changed:', user)
    setState({ user })

    // If no user, cancel existing subscriptions
    if (!user) {
      if (unsubscribeFromOnlineSits) {
        console.log('unsubscribeFromOnlineSits()')
        unsubscribeFromOnlineSits()
        unsubscribeFromOnlineSits = undefined
      }
      if (unsubscribeFromOutgoingFriendRequests) {
        console.log('unsubscribeFromOutgoingFriendRequests()')
        unsubscribeFromOutgoingFriendRequests()
        unsubscribeFromOutgoingFriendRequests = undefined
      }
      if (unsubscribeFromIncomingFriendRequests) {
        console.log('unsubscribeFromIncomingFriendRequests()')
        unsubscribeFromIncomingFriendRequests()
        unsubscribeFromIncomingFriendRequests = undefined
      }
      return
    }

    // If logged in, subscribe to user's sits & friend requests
    console.log('Subscribing to online sits')
    unsubscribeFromOnlineSits = firestore()
      .collection('sits')
      .where('user_id', '==', user.uid)
      .orderBy('date', 'desc')
      .onSnapshot(results => {
        console.log("firestore().collection('sits').onSnapshot()")
        setState({
          onlineSits: results.docs
            // @ts-ignore: doc.data() has imprecise typing so manually specifying instead
            .map((doc): { date: FirebaseFirestoreTypes.Timestamp } & OnlineSit => ({ id: doc.id, ...doc.data() }))

            // Convert Firebase Timestamp to normal js Date
            .map(d => ({ ...d, date: d.date.toDate() })),
        })
      })

    console.log('Subscribing to outgoing friend requests')
    unsubscribeFromOutgoingFriendRequests = firestore()
      .collection('pendingFriendRequests')
      .where('from', '==', user.uid)
      .onSnapshot(results => {
        console.log('outgoing pendingFriendRequests.onSnapshot()')
        setState({
          // @ts-ignore: doc.data() has imprecise typing so manually specifying instead
          outgoingFriendRequests: results.docs.map((doc): PendingFriendRequest => ({ id: doc.id, ...doc.data() })),
        })
      })

    console.log('Subscribing to incoming friend requests')
    unsubscribeFromIncomingFriendRequests = firestore()
      .collection('pendingFriendRequests')
      .where('to_user_id', '==', user.uid)
      .onSnapshot(results => {
        console.log('incoming pendingFriendRequests.onSnapshot()')
        const incomingFriendRequests: PendingFriendRequest[] = []
        const acceptedFriendRequests: PendingFriendRequest[] = []
        const rejectedFriendRequests: PendingFriendRequest[] = []

        results.docs.forEach(doc => {
          // @ts-ignore: doc.data() has imprecise typing so manually specifying instead
          const request: PendingFriendRequest = { id: doc.id, ...doc.data() }
          if (request.accepted) {
            acceptedFriendRequests.push(request)
          } else if (request.rejected) {
            rejectedFriendRequests.push(request)
          } else {
            incomingFriendRequests.push(request)
          }
        })

        setState({
          acceptedFriendRequests,
          incomingFriendRequests,
          rejectedFriendRequests,
        })
      })
  })

  return () => {
    unsubscribeFromOnlineSits && unsubscribeFromOnlineSits()
    unsubscribeFromOutgoingFriendRequests && unsubscribeFromOutgoingFriendRequests()
    unsubscribeFromIncomingFriendRequests && unsubscribeFromIncomingFriendRequests()
    unsubscribeFromAuth()
  }
}

export default { init }
