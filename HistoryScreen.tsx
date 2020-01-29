import React from 'react'
import { Alert, FlatList, Text, TouchableOpacity, View } from 'react-native'
import dayjs from 'dayjs'
import calcStreak from './calc-streak'
import { Props } from './reducer'

export default ({ history, setState }: Props) => {
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
          marginHorizontal: 10,
          marginVertical: 25,
          paddingVertical: 7,
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
        indicatorStyle="white"
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
            activeOpacity={0.5}
            onPress={() =>
              Alert.alert(
                'Remove this sit?',
                `${dayjs(i.date).format('ddd MMM D h[:]mma')} for ${
                  i.elapsed < i.duration ? i.elapsed + ' of ' : ''
                }${i.duration} min`,
                [
                  { text: 'Cancel' },
                  {
                    onPress: () => {
                      const newHistory = [...history]
                      newHistory.splice(index, 1)
                      setState({ history: newHistory })
                    },
                    style: 'destructive',
                    text: 'Delete',
                  },
                ],
              )
            }
            style={{ flexDirection: 'row', paddingHorizontal: 24, paddingVertical: 8 }}
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
        onPress={() => setState({ screen: 'InitScreen' })}
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
