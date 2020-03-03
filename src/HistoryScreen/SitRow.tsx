import dayjs from 'dayjs'
import React from 'react'
import { Text, View } from 'react-native'
import { Sit } from 'src/reducer'

const Faded = (props: any) => <Text {...props} style={{ color: '#fff8', fontWeight: '400', ...props.style }} />

const SitRow = ({
  ITEM_HEIGHT = 36,
  alwaysShowDayLabel,
  history,
  i,
  index,
  onlineSitsByDate,
}: {
  ITEM_HEIGHT?: number
  alwaysShowDayLabel?: boolean
  history: Sit[]
  i: Sit
  index: number
  onlineSitsByDate?: any
}) => {
  return (
    <View style={{ alignItems: 'center', flexDirection: 'row', height: ITEM_HEIGHT, paddingHorizontal: 24 }}>
      {/* day label */}
      <View style={{ alignItems: 'flex-end', marginRight: 10, width: 90 }}>
        <Faded>{dayLabel(i.date, index, history, alwaysShowDayLabel)}</Faded>
      </View>

      {/* sit details */}
      <View
        style={{
          backgroundColor: i.selected ? '#f004' : undefined,
          flexDirection: 'row',
          padding: 4,
          paddingRight: 8,
        }}
      >
        {/* start time */}
        <View style={{ alignItems: 'flex-end', marginRight: 5, width: 70 }}>
          <Text
            style={{
              color: '#fffb',
              fontSize: 16,
              fontWeight: '600',
            }}
          >
            {dayjs(i.date).format('h[:]mma')}
          </Text>
        </View>

        <Faded style={{ top: 2 }}> for &nbsp;</Faded>

        {/* duration */}
        <Text
          style={{
            color: '#fffb',
            fontSize: 16,
            fontWeight: '600',
          }}
        >
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
  )
}

function dayLabel(date: Date, index: number, history: any, alwaysShow?: boolean) {
  // Only show label for first item of a particular day
  if (!alwaysShow && index > 0 && history[index - 1].date.getDate() === date.getDate()) {
    return ''
  }

  if (
    dayjs()
      .startOf('day')
      .isBefore(date)
  ) {
    return 'today'
  }

  if (
    dayjs()
      .subtract(1, 'day')
      .startOf('day')
      .isBefore(date)
  ) {
    return 'yesterday'
  }

  return `${dayjs()
    .startOf('day')
    .diff(dayjs(date).startOf('day'), 'day')} days ago`
}

export default SitRow
