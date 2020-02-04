import dayjs from 'dayjs'
import React, { memo } from 'react'
import { Alert, FlatList, Text, TouchableOpacity, View } from 'react-native'

import { Props } from '../reducer'

const ITEM_HEIGHT = 36

interface ListViewProps extends Props {
  onPress?: (index: number) => void
}

const ListView = ({ history, onPress, setState }: ListViewProps) => (
  <FlatList
    data={history}
    getItemLayout={(_data, index) => ({ index, length: ITEM_HEIGHT, offset: ITEM_HEIGHT * index })}
    indicatorStyle="white"
    initialNumToRender={17}
    keyExtractor={(_item, index) => String(index)}
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
        onLongPress={() => {
          const newHistory = [...history]
          newHistory[index].selected = true
          setState({ history: newHistory, screen: 'MultiDeleteScreen' })
        }}
        onPress={
          onPress
            ? () => onPress(index)
            : () =>
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
        style={{ alignItems: 'center', flexDirection: 'row', height: ITEM_HEIGHT, paddingHorizontal: 24 }}
      >
        <View style={{ alignItems: 'flex-end', marginRight: 10, width: 90 }}>
          <Faded>{dayLabel(i.date, index, history)}</Faded>
        </View>
        <View
          style={{
            backgroundColor: i.selected ? '#f004' : undefined,
            flexDirection: 'row',
            padding: 4,
            paddingRight: 8,
          }}
        >
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
          <Faded> for &nbsp;</Faded>
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
        </View>
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

export default memo(ListView)
