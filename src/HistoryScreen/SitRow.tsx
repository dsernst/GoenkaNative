import dayjs from 'dayjs';
import React from 'react';
import {Text, View} from 'react-native';
import {Sit} from 'src/reducer';

const Faded = (props: any) => (
  <Text
    {...props}
    style={{color: '#fff8', fontWeight: '400', ...props.style}}
  />
);

const SitRow = ({
  ITEM_HEIGHT = 36,
  alwaysShowDayLabel,
  history,
  i,
  index,
  onlineSitsByDate,
}: {
  ITEM_HEIGHT?: number;
  alwaysShowDayLabel?: boolean;
  history: Sit[];
  i: Sit;
  index: number;
  onlineSitsByDate?: any;
}) => {
  return (
    <View
      style={{
        alignItems: 'center',
        flexDirection: 'row',
        height: ITEM_HEIGHT,
        paddingHorizontal: 24,
      }}>
      {/* day label */}
      <View style={{alignItems: 'flex-end', marginRight: 10, width: 90}}>
        {dayLabel(i.date, index, history, alwaysShowDayLabel)}
      </View>

      {/* sit details */}
      <View
        style={{
          backgroundColor: i.selected ? '#f004' : undefined,
          flexDirection: 'row',
          padding: 4,
          paddingRight: 8,
        }}>
        {/* start time */}
        <View style={{alignItems: 'flex-end', marginRight: 5, width: 70}}>
          <Text
            style={{
              color: '#fffb',
              fontSize: 16,
              fontWeight: '600',
            }}>
            {dayjs(i.date).format('h[:]mma')}
          </Text>
        </View>

        <Faded style={{top: 2}}> for &nbsp;</Faded>

        {/* duration */}
        <Text
          style={{
            color: '#fffb',
            fontSize: 16,
            fontWeight: '600',
          }}>
          {i.elapsed < i.duration && i.elapsed + ' of '}
          {i.duration} min
        </Text>

        {/* isUnsync'ed dot */}
        {onlineSitsByDate && !onlineSitsByDate[i.date.getTime()] && (
          <View
            style={{
              backgroundColor: '#f8ff70cc',
              borderRadius: 30,
              height: 5,
              left: 7,
              marginRight: 10,
              top: 7,
              width: 5,
            }}
          />
        )}
      </View>
    </View>
  );
};

function dayLabel(
  date: Date,
  index: number,
  history: any,
  alwaysShow?: boolean,
) {
  // Don't show label if not first item of a particular day
  if (
    !alwaysShow &&
    index > 0 &&
    date.getDate() === history[index - 1].date.getDate()
  ) {
    return;
  }

  let label: string;
  let showDayOfWeekName = false;

  if (dayjs().startOf('day').isBefore(date)) {
    label = 'today';
  } else if (dayjs().subtract(1, 'day').startOf('day').isBefore(date)) {
    label = 'yesterday';
  } else {
    const daysAgo = dayjs()
      .startOf('day')
      .diff(dayjs(date).startOf('day'), 'day');

    label = `${daysAgo} days ago`;

    // Show occasional subtle day-of-week name
    if (
      // Not on Sync screen
      !alwaysShow &&
      // Only once every 3 days
      !(daysAgo % 3) &&
      // Only show if next sit is also same day
      // ie: avoid one-sit-only days
      index < history.length &&
      date.getDate() === history[index + 1]?.date?.getDate()
    ) {
      showDayOfWeekName = true;
    }
  }

  return (
    <View>
      <Text style={{color: '#fff8', fontWeight: '400'}}>{label}</Text>
      {showDayOfWeekName && (
        <Text
          style={{
            color: '#fff2',
            fontWeight: '400',
            position: 'absolute',
            top: 15,
          }}>
          {dayjs(date).format('ddd')}
        </Text>
      )}
    </View>
  );
}

export default SitRow;
