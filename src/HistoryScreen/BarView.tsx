import dayjs, { Dayjs } from 'dayjs'
import _ from 'lodash'
import React, { useState } from 'react'
import { Dimensions, ScrollView, Text, TouchableOpacity, View } from 'react-native'

import { Props } from '../reducer'

const cachedGroupBy = _.memoize(_.groupBy)
type State = string | undefined

function BarView(props: Props) {
  const { history } = props
  const [selected, setSelected] = useState<State>()

  // If empty history
  if (!history.length) {
    return (
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
    )
  }

  // Otherwise build our Bar graph
  const now = dayjs()
  const numDaysToShow = Math.ceil(now.diff(_.last(history)!.date, 'day', true))
  const ranges: string[] = _.range(0, numDaysToShow)
    .reduce(
      (memo: Dayjs[], _unused, daysBack) => [
        now.subtract(daysBack, 'day').subtract(12, 'hour'),
        now.subtract(daysBack, 'day'),
        ...memo,
      ],
      [],
    )
    .map(s => s.format('YYYY-MM-DDa'))
  const sitsByHalfDay = cachedGroupBy(history, sit => dayjs(sit.date).format('YYYY-MM-DDa'))
  const selectedSits = selected ? sitsByHalfDay[selected] : []

  // Calc height for Details ScrollView
  const detailsYPos = 402
  const backButtonHeight = 83
  const safeHeight = Dimensions.get('window').height - props.safeAreaInsetTop - props.safeAreaInsetBottom
  const detailsHeight = safeHeight - detailsYPos - backButtonHeight

  return (
    <View style={{ marginHorizontal: 30, marginTop: 60 }}>
      <ScrollView
        contentContainerStyle={{
          alignItems: 'flex-end',
          justifyContent: 'flex-end',
          paddingLeft: 80,
          paddingRight: 100,
        }}
        contentOffset={{ x: numDaysToShow * 50, y: 0 }}
        horizontal
        indicatorStyle="white"
      >
        {/* Main content */}
        {ranges.map((range, index) => (
          <View key={index}>
            {sitsByHalfDay[range] ? (
              <TouchableOpacity
                onPress={() => setSelected(selected === range ? undefined : range)}
                style={{ justifyContent: 'flex-end', minHeight: 60 }}
              >
                {sitsByHalfDay[range].map((sit, index2) => (
                  <View
                    key={index2}
                    style={[
                      {
                        backgroundColor: `#fff${range === selected ? 'b' : '6'}`,
                        height: sit.elapsed * 2 + 1,
                      },
                      sharedStyle(index),
                    ]}
                  />
                ))}
              </TouchableOpacity>
            ) : (
              // Empty range
              <View style={[{ height: 0 }, sharedStyle(index)]} />
            )}

            {/* x axis labels */}
            <View style={{ height: 60 }}>
              {!(index % 2) && (
                <Text
                  style={{
                    bottom: 25,
                    color: '#fff4',
                    position: 'absolute',
                    textAlign: 'center',
                    transform: [{ rotate: '40deg' }],
                    width: 42,
                  }}
                >
                  {dayjs(range).format('M/D')}
                </Text>
              )}
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Selected date details */}
      {selected && (
        <View style={{ flexDirection: 'row', marginTop: 15 }}>
          <View style={{ paddingLeft: 5, paddingRight: 20, paddingTop: 2 }}>
            <Text style={{ color: '#fff7' }}>{dayjs(selected).format('ddd MMM D')}</Text>
            <Text style={{ color: '#fff4', textAlign: 'right' }}>
              {selected[selected.length - 2] === 'a' ? 'am' : 'pm'}
            </Text>
          </View>
          <View>
            <ScrollView indicatorStyle="white" style={{ height: detailsHeight, width: 215 }}>
              {[...selectedSits].reverse().map((i, index) => (
                <View key={index} style={{ flexDirection: 'row', paddingBottom: 7 }}>
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
                </View>
              ))}
            </ScrollView>
          </View>
        </View>
      )}
    </View>
  )
}

const Faded = (props: any) => <Text {...props} style={{ color: '#fff8', fontWeight: '400', ...props.style }} />

const sharedStyle = (index: number) => ({
  marginRight: index % 2 ? 15 : 2,
  marginTop: 2,
  width: 20,
})

export default BarView
