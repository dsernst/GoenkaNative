import React from 'react'
import { Alert, Button, FlatList, Text, TouchableOpacity, View } from 'react-native'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
dayjs.extend(relativeTime)
import calcStreak from './calc-streak.ts'

export type SitProps = {
  date: Date
  duration: number
  elapsed: number
}

function calcDailyStreak(history: SitProps[]) {
  return calcStreak(history.map(h => h.date))
}
// function calcTwiceDailyStreak(history: SitProps[]) {
//   return '**FIXME**'
// }

export default ({
  pressStop,
  history,
  removeSit,
}: {
  history: SitProps[]
  pressStop: () => void
  removeSit: (index: number) => () => void
}) => (
  <>
    <Text
      style={{
        color: bodyTextColor,
        marginBottom: 15,
      }}
    >
      You've sat
      {/* twice a day for {calcTwiceDailyStreak(history)} days &*/} at least once for{' '}
      {calcDailyStreak(history)} day{calcDailyStreak(history) === 1 ? '' : 's'} straight.
    </Text>
    <FlatList
      data={history}
      keyExtractor={i => i.date.toString()}
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

// Shared vars
const bodyTextColor = '#f1f1f1'
