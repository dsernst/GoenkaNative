// Run this to write existing Firebase collections to local JSON files

import fs from 'fs'
import path from 'path'

import admin, { firestore } from 'firebase-admin'

console.log('Connecting to Firebase...')
admin.initializeApp({
  credential: admin.credential.applicationDefault(),
  databaseURL: 'https://goenkatimer.firebaseio.com',
})
console.log('Connected.')

// Download all Firebase data to JSON files
type DirectionStr = 'desc' | 'asc'
const collectionsToDownload: [string, string?, DirectionStr?][] = [
  // ['friendRequests', 'created_at'],
  // ['users'],
  // ['sits', 'date', 'desc'],
]
collectionsToDownload.forEach(async ([collection, orderKey, desc]) => {
  console.log(`Downloading ${collection}...`)

  let query: firestore.Query = firestore().collection(collection)

  if (orderKey) {
    query = query.orderBy(orderKey, desc)
  }

  const data = (await query.get()).docs.map((doc: any) => ({ id: doc.id, ...doc.data() }))
  fs.writeFileSync(path.join(__dirname, `/${collection}.json`), JSON.stringify(data))
  console.log(`Wrote ${data.length} rows to ${collection}.json`)
})
