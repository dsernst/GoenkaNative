import dayjs from 'dayjs';
import _ from 'lodash';

const exampleSits = [
  {
    daysAgo: 0,
    duration: 20,
    time: '13:01',
  },
  {
    daysAgo: 0,
    duration: 15,
    time: '9:14',
  },
  {
    daysAgo: 1,
    duration: 35,
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
    duration: 1,
    time: '21:50',
  },
  {
    daysAgo: 2,
    duration: 60,
    time: '11:57',
  },
  // {
  //   daysAgo: 2,
  //   duration: 5,
  //   time: '08:23',
  // },
  {
    daysAgo: 3,
    duration: 35,
    time: '8:25',
  },
  {
    daysAgo: 4,
    duration: 20,
    time: '21:47',
  },
  // {
  //   daysAgo: 4,
  //   duration: 15,
  //   time: '10:47',
  // },
  {
    daysAgo: 4,
    duration: 15,
    time: '10:25',
  },
  {
    daysAgo: 4,
    duration: 15,
    time: '10:07',
  },
  {
    daysAgo: 5,
    duration: 75,
    time: '3:07',
  },
  {
    daysAgo: 6,
    duration: 15,
    time: '8:55',
  },
];

const sits = _.flatten(
  _.range(20).map(r =>
    exampleSits.map(s => ({
      ...s,
      date: dayjs()
        .hour(Number(s.time.split(':')[0]))
        .minute(Number(s.time.split(':')[1]))
        .subtract(s.daysAgo + r * 7, 'day')
        .toDate(),
      elapsed: s.duration,
    })),
  ),
);

export default sits;
