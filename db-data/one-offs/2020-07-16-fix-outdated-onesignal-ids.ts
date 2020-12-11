// Fix friendRequest onesignal_id getting out-of-sync

import bluebird from 'bluebird'
import admin, { firestore } from 'firebase-admin'
import { keyBy } from 'lodash'

import friendRequests from '../friendRequests.json'
import users from '../users.json'

console.log('🔌 Connecting to Firebase...')
process.env.GOOGLE_APPLICATION_CREDENTIALS = './goenkatimer-firebase-adminsdk-2lqcs-f9c0d551b4.json'
admin.initializeApp({
  credential: admin.credential.applicationDefault(),
  databaseURL: 'https://goenkatimer.firebaseio.com',
})
console.log('🔥 Connected.')

const usersByPhone = keyBy(users, 'id')

console.log(`Reviewing ${friendRequests.length} friendRequests...`)

let count = 0

// Look at each friend request to validate Onesignal_ID
bluebird
  .map(
    friendRequests,
    async fR => {
      if (usersByPhone[fR.from_phone].onesignal_id !== fR.from_onesignal_id) {
        console.log(`\n${++count}. Fixing ${fR.from_name} -> ${fR.to_name}...`)
        await firestore()
          .collection('friendRequests')
          .doc(fR.id)
          .update({ from_onesignal_id: usersByPhone[fR.from_phone].onesignal_id })
        console.log('Fixed.')
      }
      if (usersByPhone[fR.to_phone].onesignal_id !== fR.to_onesignal_id) {
        console.log(`\n${++count}. Fixing ${fR.to_name} <- ${fR.from_name}...`)
        await firestore()
          .collection('friendRequests')
          .doc(fR.id)
          .update({ to_onesignal_id: usersByPhone[fR.to_phone].onesignal_id })
        console.log('Fixed.')
      }
    },
    { concurrency: 1 },
  )
  .then(() => console.log('\nDone.'))
