// Adapted from https://github.com/iancanderson/streaker-js/blob/b8e1b941d28ae57ba9942bcfbdcbdab5743db2b9/streaker.js

import dayjs, { Dayjs } from 'dayjs'

const now = () => dayjs()
const rangeContains = (start: Dayjs, end: Dayjs, date: Date) =>
  start.isBefore(date) && end.isAfter(date)

export default (date_times: Date[]) => {
  let streak = 0

  // Starting from yesterday, count days that streak was met
  let start_date = now().subtract(1, 'day')
  while (true) {
    if (
      date_times.some((date: Date) =>
        rangeContains(start_date.startOf('day'), start_date.endOf('day'), date),
      )
    ) {
      streak++
    } else {
      break
    }
    start_date = start_date.subtract(1, 'day')
  }

  // Check if today met streak
  // (Waits until midnight before streak resets back to 0)
  if (date_times.some(date => rangeContains(now().startOf('day'), now().endOf('day'), date))) {
    streak++
  }

  return streak
}
