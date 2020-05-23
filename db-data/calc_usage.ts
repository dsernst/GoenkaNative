// Fix friendRequest onesignal_id getting out-of-sync (w/ Henry, for example)

import dayjs from 'dayjs'
import { groupBy, round, sumBy } from 'lodash'

import sits from './sits.json'

const sitsInTheLastDay = sits.filter(sit => dayjs().diff(dayjs(sit.date._seconds * 1000), 'day') < 1)
const sitsInTheLastWeek = sits.filter(sit => dayjs().diff(dayjs(sit.date._seconds * 1000), 'day') < 7)

const tuple: [any[], string, boolean?][] = [
  [sitsInTheLastDay, 'the last day'],
  [sitsInTheLastWeek, 'the last week'],
  [sits, 'total', true],
]

console.log('\n\n --- GoenkaTimer Stats --- ')

tuple.forEach(([set, intro, have]) => {
  const numPeople = Object.keys(groupBy(set, 'user_id')).length
  const numSits = set.length
  const totalMinutes = sumBy(set, 'elapsed')
  const hours = round(totalMinutes / 60, 1)

  console.log(
    `\nIn ${intro}, ${numPeople} people ${have ? 'have ' : ''}recorded ${numSits} sits equal to ${hours} hours.`,
  )
})
