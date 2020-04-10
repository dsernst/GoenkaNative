import { memoize } from 'lodash'
import React from 'react'
import { Text } from 'react-native'

import { Props } from '../reducer'
import calcStreaks from './calc-streaks'

const calcStreaksMemoized = memoize(calcStreaks)

export default (props: Props) => {
  const { history } = props
  const dates = history.map(h => h.date)
  const [dailyStreak, twiceADayStreak] = calcStreaksMemoized(dates)

  return (
    <Text
      style={{
        color: '#fffe',
        fontWeight: '600',
        lineHeight: 21,
        textAlign: 'center',
      }}
    >
      <Faded>You've sat twice a day for </Faded>
      {twiceADayStreak} day
      {twiceADayStreak === 1 ? '' : 's'}
      <Faded>,</Faded>
      {'\n'}
      <Faded>& at least once for </Faded>
      {dailyStreak} day
      {dailyStreak === 1 ? '' : 's'} straight<Faded>.</Faded>
    </Text>
  )
}

const Faded = (props: any) => <Text {...props} style={{ color: '#fff8', fontWeight: '400', ...props.style }} />
