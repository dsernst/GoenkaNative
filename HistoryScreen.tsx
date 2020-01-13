import React from 'react'
import { Alert, Button, FlatList, Text, TouchableOpacity, View } from 'react-native'
import dayjs from 'dayjs'

type SitProps = {
  date: Date
  duration: number
  elapsed: number
}

const HistoryScreen = ({
  pressStop,
  history,
  removeSit,
}: {
  history: SitProps[]
  pressStop: () => void
  removeSit: (index: number) => () => void
}) => (
  <>
    <FlatList
      data={history}
      keyExtractor={i => i.date.toString()}
      ListHeaderComponent={() => (
        <Text
          style={{
            color: bodyTextColor,
            fontSize: 18,
            fontWeight: '600',
            marginBottom: 10,
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
            {dayjs(i.date).format('ddd MMM D · h[:]mma')} <Text style={{ opacity: 0.5 }}>for</Text>{' '}
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

export default HistoryScreen
