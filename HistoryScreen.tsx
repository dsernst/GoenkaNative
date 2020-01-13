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
  pressStop,
  history,
  removeSit,
}: {
  history: SitProps[]
  pressStop: () => void
  removeSit: (index: number) => () => void
}) => {
  const dailyStreak = calcStreak(history.map(h => h.date))
  // eslint-disable-next-line prettier/prettier
  const twiceADayStreak = calcStreak(
    history.map(h => h.date),
    2,
  )

  return (
    <>
      <Text
        style={{
          color: bodyTextColor,
          marginBottom: 15,
        }}
      >
        You've sat twice a day for {twiceADayStreak} day
        {twiceADayStreak === 1 ? '' : 's'} & at least once for {dailyStreak} day
        {dailyStreak === 1 ? '' : 's'} straight.
      </Text>
      <FlatList
        data={history}
        keyExtractor={i => i.date.toString()}
        ListEmptyComponent={() => (
          <Text
            style={{
              color: bodyTextColor,
              fontSize: 16,
              fontStyle: 'italic',
              opacity: 0.8,
              paddingTop: 8,
            }}
          >
            You don't have any sits yet.
          </Text>
        )}
        ListHeaderComponent={() => (
          <Text
            style={{
              color: bodyTextColor,
              marginVertical: 10,
              opacity: 0.6,
              paddingTop: 10,
            }}
          >
            Recent sits:
          </Text>
        )}
        renderItem={({ item: i, index }) => (
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
            style={{ paddingVertical: 8 }}
          >
            <Text
              style={{
                color: bodyTextColor,
                fontSize: 16,
                opacity: 0.8,
              }}
            >
              {dayjs(i.date).fromNow()}
              {' · '}
              {dayjs(i.date).format('h[:]mma')}
              <Text style={{ opacity: 0.5 }}> for </Text>
              {i.elapsed < i.duration && i.elapsed + ' of '}
              {i.duration} min
            </Text>
          </TouchableOpacity>
        )}
      />
      <View style={{ marginBottom: 52, opacity: 0.2 }}>
        <Button color="white" onPress={pressStop} title="Back" />
      </View>
    </>
  )
}

// Shared vars
const bodyTextColor = '#f1f1f1'
