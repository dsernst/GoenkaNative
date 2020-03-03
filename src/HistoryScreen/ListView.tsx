import dayjs from 'dayjs'
import _ from 'lodash'
import React, { memo } from 'react'
import { Alert, FlatList, Text, TouchableOpacity } from 'react-native'

import { Props } from '../reducer'
import SitRow from './SitRow'

const ITEM_HEIGHT = 36

interface ListViewProps extends Props {
  onPress?: (index: number) => void
}

const ListView = ({ history, onPress, onlineSits, setState, user }: ListViewProps) => {
  const onlineSitsByDate = user && _.keyBy(onlineSits, oS => oS.date.getTime())

  return (
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
        >
          <SitRow {...{ ITEM_HEIGHT, history, i, index, onlineSitsByDate }} />
        </TouchableOpacity>
      )}
    />
  )
}

export default memo(ListView)
