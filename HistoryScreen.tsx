import React from 'react'
import { Alert, Button, FlatList, Text, TouchableOpacity, View } from 'react-native'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
dayjs.extend(relativeTime)
import calcStreak from './calc-streak'

export type SitProps = {
  date: Date
  duration: number
  elapsed: number
}

export default ({
  history,
  pressStop,
  removeSit,
}: {
  history: SitProps[]
  pressStop: () => void
  removeSit: (index: number) => () => void
}) => {
  const dates = history.map(h => h.date)
  const dailyStreak = calcStreak(dates)
  const twiceADayStreak = calcStreak(dates, 2)

  const Faded = (props: any) => (
    <Text
      {...props}
      style={{ color: bodyTextColor, fontWeight: '400', opacity: 0.6, ...props.style }}
    />
  )

  function dayLabel(date: Date, index: number) {
    // Only show label for first item of a particular day
    if (index > 0 && history[index - 1].date.getDate() === date.getDate()) {
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

  return (
    <>
      <View
        style={{
          borderBottomWidth: 1,
          borderColor: '#fff2',
          borderTopWidth: 1,
          marginBottom: 35,
          marginTop: 45,
          paddingVertical: 5,
        }}
      >
        <Text
          style={{
            alignSelf: 'center',
            color: bodyTextColor,
            fontSize: 11,
            fontWeight: '500',
          }}
        >
          HISTORY
        </Text>
      </View>

      <Text
        style={{
          color: bodyTextColor,
          fontWeight: '600',
          lineHeight: 21,
          marginBottom: 30,
          textAlign: 'center',
        }}
      >
        <Faded>You've sat twice a day for </Faded>
        {twiceADayStreak} day
        {twiceADayStreak === 1 ? '' : 's'}
        <Faded>,</Faded>
        {'\n'}
        <Faded>& at least once for </Faded>
        {dailyStreak} day
        {dailyStreak === 1 ? '' : 's'} straight<Faded>.</Faded>
      </Text>

      <FlatList
        data={history}
        keyExtractor={i => i.date.toString()}
        ListEmptyComponent={() => (
          <Text
            style={{
              alignSelf: 'center',
              color: bodyTextColor,
              fontSize: 16,
              fontStyle: 'italic',
              opacity: 0.6,
              paddingTop: 80,
            }}
          >
            You don't have any sits recorded yet.
          </Text>
        )}
        renderItem={({ index, item: i }) => (
          <TouchableOpacity
            onPress={() =>
              Alert.alert(
                'Remove this sit?',
                `${dayjs(i.date).format('ddd MMM D h[:]mma')} for ${
                  i.elapsed < i.duration ? i.elapsed + ' of ' : ''
                }${i.duration} min`,
                [
                  { text: 'Cancel' },
                  { onPress: removeSit(index), style: 'destructive', text: 'Delete' },
                ],
              )
            }
            style={{ alignContent: 'flex-start', flexDirection: 'row', paddingVertical: 8 }}
          >
            <View style={{ alignItems: 'flex-end', marginRight: 10, width: 90 }}>
              <Faded>{dayLabel(i.date, index)}</Faded>
            </View>
            <View style={{ alignItems: 'flex-end', marginRight: 5, width: 70 }}>
              <Text
                style={{
                  color: bodyTextColor,
                  fontSize: 16,
                  fontWeight: '600',
                  opacity: 0.8,
                }}
              >
                {dayjs(i.date).format('h[:]mma')}
              </Text>
            </View>
            <Faded style={{ alignSelf: 'flex-end' }}> for &nbsp;</Faded>
            <Text
              style={{
                color: bodyTextColor,
                fontSize: 16,
                fontWeight: '600',
                opacity: 0.8,
              }}
            >
              {i.elapsed < i.duration && i.elapsed + ' of '}
              {i.duration} min
            </Text>
          </TouchableOpacity>
        )}
      />
      <TouchableOpacity
        onPress={pressStop}
        style={{
          alignItems: 'center',
          marginVertical: 10,
          paddingBottom: 50,
          paddingTop: 15,
        }}
      >
        <Text style={{ color: 'white', fontSize: 18, opacity: 0.2 }}>Back</Text>
      </TouchableOpacity>
    </>
  )
}

// Shared vars
const bodyTextColor = '#f1f1f1'
