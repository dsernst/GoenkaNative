import moment from 'moment';

export const ONE_SIGNAL_APP_ID = 'bcfb2833-18d0-4b12-8e53-647f1068c5a8';
export const AM_NOTIFICATION_TIME = moment(
  '2020-01-01 08:00 AM',
  'YYYY-MM-DD hh:mm A',
).toDate();
export const PM_NOTIFICATION_TIME = moment(
  '2020-01-01 08:15 PM',
  'YYYY-MM-DD hh:mm A',
).toDate();
