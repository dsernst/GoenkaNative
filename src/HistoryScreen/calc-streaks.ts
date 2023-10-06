import dayjs from 'dayjs';

export default (date_times: Date[]) => {
  let daily_streak = 0;
  let twice_a_day_streak = 0;

  let startOfDayToCheck = dayjs().startOf('day');
  let alreadySawOne = false;
  let alreadySawTwo = false;
  let twiceDailyStreakActive = true;

  // Iterate through our recorded sit dates
  date_times.some(date => {
    // Is this date earlier than the date we're looking for?
    if (startOfDayToCheck.isAfter(date)) {
      const firstDay = startOfDayToCheck.isSame(dayjs(), 'day');
      // Was our twice daily streak broken?
      if (twiceDailyStreakActive && !alreadySawTwo && !firstDay) {
        twiceDailyStreakActive = false;
      }

      // Move back the day we're looking for
      startOfDayToCheck = startOfDayToCheck.subtract(1, 'day');

      // Does this break our daily streak?
      if (startOfDayToCheck.isAfter(date)) {
        // Break out of this iteration and return current counts
        return true;
      }

      alreadySawOne = false;
      alreadySawTwo = false;
    }

    if (!alreadySawOne) {
      daily_streak++;
      alreadySawOne = true;
    } else {
      if (twiceDailyStreakActive && !alreadySawTwo) {
        twice_a_day_streak++;
        alreadySawTwo = true;
      }
    }
    return false; // To squelch ts "no-implicit-return" warning
  });

  return [daily_streak, twice_a_day_streak];
};
