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
  const numDaysToShow = Math.ceil(now.endOf('day').diff(_.last(history)!.date, 'day', true))
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
  const selectedSits = (selected && sitsByHalfDay[selected]) || []

  // Calc height for Details ScrollView
  const detailsYPos = 445
  const backButtonHeight = 83
  const { height: screenHeight, width: screenWidth } = Dimensions.get('window')
  const safeHeight = screenHeight - props.safeAreaInsetTop - props.safeAreaInsetBottom
  const detailsHeight = safeHeight - detailsYPos - backButtonHeight

  const yLabels = [60, 45, 30, 15, '']
  const barHeight = 120

  return (
    <View style={{ marginLeft: 15, marginRight: 15, marginTop: 30 }}>
      {/* y axis */}
      <View
        style={{
          height: barHeight + 17,
          justifyContent: 'space-between',
          position: 'absolute',
        }}
      >
        {yLabels.map(label => (
          <View key={label} style={{ alignItems: 'center', flexDirection: 'row', justifyContent: 'flex-end' }}>
            <Text style={{ color: '#fff3' }}>{label}</Text>
            <View style={{ backgroundColor: '#fff1', height: 1, marginLeft: 15, width: screenWidth - 94 }} />
          </View>
        ))}
      </View>

      {/* Main bar graph content */}
      <ScrollView
        contentContainerStyle={{
          alignItems: 'flex-end',
          justifyContent: 'flex-end',
          paddingLeft: 10,
          paddingRight: 10,
          paddingTop: 7,
        }}
        contentOffset={{ x: numDaysToShow * 50, y: 0 }}
        horizontal
        indicatorStyle="white"
        style={{
          marginLeft: 35,
        }}
      >
        {ranges.map((range, index) => (
          <View key={index}>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => setSelected(selected === range ? undefined : range)}
              style={[
                {
                  justifyContent: 'flex-end',
                  marginRight: index % 2 ? 12 : 4,
                  minHeight: 120,
                },
                range === selected &&
                  !sitsByHalfDay[range] && { borderBottomWidth: 2, borderColor: '#06c93acc', marginBottom: -2 },
              ]}
            >
              {sitsByHalfDay[range] ? (
                [...sitsByHalfDay[range]].reverse().map((sit, index2) => (
                  <View
                    key={index2}
                    style={{
                      backgroundColor: range === selected ? '#BCC1BD' : '#69736C',
                      height: sit.elapsed * 2 + 1,
                      marginTop: 2,
                      ...barWidth,
                    }}
                  />
                ))
              ) : (
                // Empty range
                <View style={barWidth} />
              )}
            </TouchableOpacity>

            {/* x axis */}
            <View style={{ height: xAxisHeight }}>
              {!(index % 2) && (
                <>
                  {/* tick marks */}
                  <View style={{ backgroundColor: '#fff2', height: 4, left: 21, top: 4, width: 1 }} />

                  {/* date labels */}
                  <Text
                    style={{
                      bottom: 25,
                      color: '#fff3',
                      position: 'absolute',
                      textAlign: 'center',
                      transform: [{ rotate: '40deg' }],
                      width: 42,
                    }}
                  >
                    {dayjs(range).format('M/D')}
                  </Text>
                </>
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
            {!selectedSits.length ? (
              <Text style={{ color: '#fff5', fontStyle: 'italic', paddingLeft: 10, paddingTop: 2 }}>
                No sits recorded.
              </Text>
            ) : (
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
                    <Text style={{ alignSelf: 'flex-end', color: '#fff8', fontWeight: '400' }}> for &nbsp;</Text>
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
            )}
          </View>
        </View>
      )}
    </View>
  )
}

const barWidth = { width: 20 }
const xAxisHeight = 60

export default BarView
