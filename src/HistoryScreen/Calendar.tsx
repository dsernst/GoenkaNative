import dayjs, { Dayjs } from 'dayjs'
import _ from 'lodash'
import React, { Component } from 'react'
import { Dimensions, ScrollView, Text, TouchableOpacity, View } from 'react-native'
import EvilIcons from 'react-native-vector-icons/EvilIcons'

import { Props } from '../reducer'

type State = { month: Dayjs; selected: Dayjs | null }

// Calc height for Details ScrollView
const detailsYPos = 488
const backButtonHeight = 61
const detailsHeight = Dimensions.get('window').height - detailsYPos - backButtonHeight

export default class extends Component<Props, State> {
  state: State = {
    month: dayjs(),
    selected: dayjs(),
  }

  render() {
    const { month, selected } = this.state

    let counter = 1
    const now = dayjs()

    const firstDayOfMonth = month.startOf('month')
    const daysInMonth = month.daysInMonth()
    const weeksInMonth = Math.ceil(daysInMonth / 7)
    const inCurrMonth = month.isSame(now, 'month')
    const YYYYdashMM = month.format('YYYY-MM')

    const sitsByDate = _.groupBy(this.props.history, sit => dayjs(sit.date).format('YYYY-MM-DD'))

    const selectedSits = selected && sitsByDate[selected.format('YYYY-MM-DD')]
    const selectedIsFuture = selected?.isAfter(now, 'day')
    const selectedIsToday = selected?.isSame(now, 'day')

    return (
      <View style={{ marginHorizontal: 19 }}>
        {/* Month selector */}
        <View
          style={{
            alignItems: 'center',
            borderBottomColor: '#fff2',
            borderBottomWidth: 1,
            flexDirection: 'row',
            justifyContent: 'space-between',
            paddingBottom: 3,
          }}
        >
          <TouchableOpacity
            onPress={() => this.setState({ month: this.state.month.subtract(1, 'month'), selected: null })}
            style={{ borderColor: 'red', borderWidth: 0, paddingRight: 15, paddingVertical: 5 }}
          >
            <EvilIcons color="#fff6" name="chevron-left" size={29} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => this.setState({ month: now, selected: now })}
            style={{ borderColor: 'red', borderWidth: 0, paddingHorizontal: 20, paddingVertical: 5 }}
          >
            <Text style={{ color: '#fffb', fontSize: 16, textAlign: 'center' }}>
              {this.state.month.format('MMMM YYYY')}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            disabled={inCurrMonth}
            onPress={() => this.setState({ month: this.state.month.add(1, 'month'), selected: null })}
            style={{
              borderColor: 'red',
              borderWidth: 0,
              opacity: inCurrMonth ? 0 : 1,
              paddingLeft: 15,
              paddingVertical: 5,
            }}
          >
            <EvilIcons color="#fff6" name="chevron-right" size={29} />
          </TouchableOpacity>
        </View>

        {/* Header Row: days of week */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-around', paddingVertical: 10 }}>
          {'SMTWTFS'.split('').map((letter, index) => (
            <Text key={index} style={{ color: '#fff6' }}>
              {letter}
            </Text>
          ))}
        </View>

        {/* Days grid */}
        {_.range(0, weeksInMonth).map(wk => (
          <View key={wk} style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
            {/* For each week: */}
            {_.range(0, 7).map(position => {
              const key = `${wk}${position}`
              if (counter === 1 && position < Number(firstDayOfMonth.format('d'))) {
                return <EmptyCell key={key} /> // Before the 1st of the month
              } else if (counter < daysInMonth) {
                /* One day cell */
                const date = `${YYYYdashMM}-${(counter < 10 ? '0' : '') + counter}`
                const sits = sitsByDate[date]
                const satAtLeastOnce = sits?.length >= 1
                const satAtLeastTwice = sits?.length >= 2
                const day = dayjs(date)
                const isToday = day.isSame(now, 'day')
                const isFuture = day.isAfter(now, 'day')
                const isSelected = selected && day.isSame(selected, 'day')
                return (
                  <TouchableOpacity
                    key={key}
                    onPress={() => this.setState({ selected: day })}
                    style={{ backgroundColor: isSelected ? '#0008' : undefined, padding: cellPadding }}
                  >
                    <View
                      style={{
                        backgroundColor: satAtLeastTwice ? (isSelected ? '#fff2' : '#fff3') : undefined,
                        borderColor: '#fff6',
                        borderRadius: cellWidth,
                        borderWidth: satAtLeastOnce ? 1 : 0,
                        height: cellWidth,
                        justifyContent: 'center',
                        width: cellWidth,
                      }}
                    >
                      <Text
                        style={{
                          color: satAtLeastOnce ? '#fffb' : '#fff9',
                          fontWeight: isToday ? '800' : '400',
                          opacity: isFuture ? 0.5 : 1,
                          textAlign: 'center',
                        }}
                      >
                        {counter++}
                      </Text>
                    </View>
                  </TouchableOpacity>
                )
              } else {
                return <EmptyCell key={key} /> // After the last day of the month
              }
            })}
          </View>
        ))}

        {/* Selected date details */}
        {selected && (
          <View style={{ flexDirection: 'row', marginTop: 15 }}>
            <Text style={{ color: '#fff6', paddingLeft: 10, width: 100 }}>{selected?.format('ddd MMM D')}</Text>
            <View>
              {selectedIsFuture ? (
                <Text style={{ color: '#fffb', fontStyle: 'italic', paddingLeft: 10 }}>The future is unwritten.</Text>
              ) : !selectedSits ? (
                <Text style={{ color: '#fffb', fontStyle: 'italic', paddingLeft: 10 }}>
                  No sits recorded {selectedIsToday ? 'today, yet' : 'this day'}.
                </Text>
              ) : (
                <ScrollView style={{ height: detailsHeight }}>
                  {selectedSits.map((i, index) => (
                    <View key={index} style={{ flexDirection: 'row', paddingBottom: 3 }}>
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
              )}
            </View>
          </View>
        )}
      </View>
    )
  }
}

const cellWidth = 30
const cellPadding = 4

const EmptyCell = () => <View style={{ width: cellWidth + 2 * cellPadding }} />
const Faded = (props: any) => <Text {...props} style={{ color: '#fff8', fontWeight: '400', ...props.style }} />
