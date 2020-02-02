import dayjs from 'dayjs'
import React from 'react'
import { Alert, FlatList, Text, TouchableOpacity, View } from 'react-native'

import { Props } from '../reducer'

export default ({ history, setState }: Props) => (
  <FlatList
    data={history}
    indicatorStyle="white"
    keyExtractor={i => i.date.toString()}
    ListEmptyComponent={() => (
      <Text
        style={{
          alignSelf: 'center',
          color: '#fff7',
          fontSize: 16,
          fontStyle: 'italic',
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
            `${dayjs(i.date).format('ddd MMM D h[:]mma')} for ${i.elapsed < i.duration ? i.elapsed + ' of ' : ''}${
              i.duration
            } min`,
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
          <Faded>{dayLabel(i.date, index, history)}</Faded>
        </View>
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
        <Faded style={{ alignSelf: 'flex-end' }}> for &nbsp;</Faded>
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
      </TouchableOpacity>
    )}
  />
)

const Faded = (props: any) => <Text {...props} style={{ color: '#fff8', fontWeight: '400', ...props.style }} />

function dayLabel(date: Date, index: number, history: any) {
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
