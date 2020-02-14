import dayjs from 'dayjs'

const exampleSits = [
  {
    daysAgo: 0,
    duration: 45,
    time: '18:01',
  },
  {
    daysAgo: 0,
    duration: 15,
    time: '9:14',
  },
  {
    daysAgo: 1,
    duration: 45,
    time: '20:58',
  },
  {
    daysAgo: 1,
    duration: 5,
    time: '9:50',
  },
  {
    daysAgo: 2,
    duration: 10,
    time: '22:30',
  },
  {
    daysAgo: 2,
    duration: 60,
    time: '11:57',
  },
  {
    daysAgo: 3,
    duration: 35,
    time: '8:25',
  },
  {
    daysAgo: 4,
    duration: 30,
    time: '21:47',
  },
  {
    daysAgo: 4,
    duration: 15,
    time: '10:27',
  },
  {
    daysAgo: 6,
    duration: 15,
    time: '8:55',
  },
]

const sits = exampleSits.map(s => ({
  ...s,
  date: dayjs()
    .hour(Number(s.time.split(':')[0]))
    .minute(Number(s.time.split(':')[1]))
    .subtract(s.daysAgo, 'day')
    .toDate(),
  elapsed: s.duration,
}))

export default sits
