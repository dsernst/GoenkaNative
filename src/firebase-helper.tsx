import { firebase } from '@react-native-firebase/auth'
import firestore from '@react-native-firebase/firestore'

import { PendingFriendRequest, setStatePayload } from './reducer'

function init(setState: (payload: setStatePayload) => void) {
  let unsubscribeFromPendingFriendRequests: (() => void) | undefined
  let unsubscribeFromOnlineSits: (() => void) | undefined
  const unsubscribeFromAuth = firebase.auth().onAuthStateChanged(user => {
    console.log('auth state changed:', user)
    setState({ user })

    // If no user, cancel existing subscriptions
    if (!user) {
      if (unsubscribeFromPendingFriendRequests) {
        console.log('unsubscribeFromPendingFriendRequests()')
        unsubscribeFromPendingFriendRequests()
        unsubscribeFromPendingFriendRequests = undefined
      }
      if (unsubscribeFromOnlineSits) {
        console.log('unsubscribeFromOnlineSits()')
        unsubscribeFromOnlineSits()
        unsubscribeFromOnlineSits = undefined
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

    console.log('Subscribing to pending friend requests')
    unsubscribeFromPendingFriendRequests = firestore()
      .collection('pendingFriendRequests')
      .where('from', '==', user.uid)
      .onSnapshot(results => {
        console.log("firestore().collection('pendingFriendRequests').onSnapshot()")
        setState({
          // @ts-ignore: doc.data() has imprecise typing so manually specifying instead
          pendingFriendRequests: results.docs.map((doc): PendingFriendRequest => ({ id: doc.id, ...doc.data() })),
        })
      })
  })

  return () => {
    unsubscribeFromPendingFriendRequests && unsubscribeFromPendingFriendRequests()
    unsubscribeFromOnlineSits && unsubscribeFromOnlineSits()
    unsubscribeFromAuth()
  }
}

export default { init }
