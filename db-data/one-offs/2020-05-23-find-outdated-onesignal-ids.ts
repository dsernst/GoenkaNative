// Fix friendRequest onesignal_id getting out-of-sync (w/ Henry, for example)

import { keyBy } from 'lodash'

import friendRequests from '../friendRequests.json'
import users from '../users.json'

const usersByPhone = keyBy(users, 'id')

console.log(`Reviewing ${friendRequests.length} friendRequests...`)

let count = 0

// Look at each friend request to validate Onesignal_ID
friendRequests.forEach(fR => {
  if (usersByPhone[fR.from_phone].onesignal_id !== fR.from_onesignal_id) {
    console.log(`\n${++count}. FROM mismatch:`)
    console.log('friendRequest', fR)
    console.log('user', usersByPhone[fR.from_phone])
  }
  if (usersByPhone[fR.to_phone].onesignal_id !== fR.to_onesignal_id) {
    console.log(`\n${++count}. TO mismatch:`)
    console.log('friendRequest', fR)
    console.log('user', usersByPhone[fR.to_phone])
  }
})

console.log('\nDone.')
