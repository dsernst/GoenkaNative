import dayjs from 'dayjs'
import _ from 'lodash'
import React, { Component } from 'react'
import { Text, TouchableOpacity, View } from 'react-native'
import EvilIcons from 'react-native-vector-icons/EvilIcons'

import { Props } from '../reducer'

export default class extends Component<Props> {
  state = {
    month: dayjs(),
  }

  render() {
    const { month } = this.state

    let counter = 1
    const now = dayjs()

    const firstDayOfMonth = month.startOf('month')
    const daysInMonth = month.daysInMonth()
    const weeksInMonth = Math.ceil(daysInMonth / 7)
    const YYYYdashMM = month.format('YYYY-MM')

    const sitsByDate = _.groupBy(this.props.history, sit => dayjs(sit.date).format('YYYY-MM-DD'))

    return (
      <View style={{ marginHorizontal: 19 }}>
        {/* Month selector */}
        <View
          style={{
            alignItems: 'center',
            borderBottomColor: '#fff6',
            borderBottomWidth: 1,
            flexDirection: 'row',
            justifyContent: 'space-between',
            paddingBottom: 15,
          }}
        >
          <TouchableOpacity
            onPress={() => this.setState({ month: this.state.month.subtract(1, 'month') })}
            style={{ borderColor: 'red', borderWidth: 0, paddingRight: 15, paddingVertical: 5 }}
          >
            <EvilIcons color="#fff6" name="chevron-left" size={29} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => this.setState({ month: now })}
            style={{ borderColor: 'red', borderWidth: 0, paddingHorizontal: 20, paddingVertical: 5 }}
          >
            <Text style={{ color: '#fffb', fontSize: 16, textAlign: 'center' }}>
              {this.state.month.format('MMMM YYYY')}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => this.setState({ month: this.state.month.add(1, 'month') })}
            style={{ borderColor: 'red', borderWidth: 0, paddingLeft: 15, paddingVertical: 5 }}
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
          <View key={wk} style={{ flexDirection: 'row', justifyContent: 'space-around', paddingVertical: 5 }}>
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
                return (
                  <View
                    key={key}
                    style={{
                      backgroundColor: satAtLeastTwice ? '#fff3' : undefined,
                      borderColor: '#fff8',
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
                )
              } else {
                return <EmptyCell key={key} /> // After the last day of the month
              }
            })}
          </View>
        ))}
      </View>
    )
  }
}

const cellWidth = 30

const EmptyCell = () => <View style={{ width: cellWidth }} />
