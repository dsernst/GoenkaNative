import React from 'react'
import { Text } from 'react-native'

import BackButton from '../BackButton'
import { Props } from '../reducer'
import TitleBar from '../TitleBar'
import calcStreak from './calc-streak'
import ListView from './ListView'

export default (props: Props) => {
  const { history } = props
  const dates = history.map(h => h.date)
  const dailyStreak = calcStreak(dates)
  const twiceADayStreak = calcStreak(dates, 2)

  return (
    <>
      <TitleBar name="HISTORY" style={{ marginHorizontal: 17 }} />

      <Text
        style={{
          color: '#fffe',
          fontWeight: '600',
          lineHeight: 21,
          marginBottom: 30,
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

      <ListView {...props} />

      <BackButton />
    </>
  )
}

const Faded = (props: any) => <Text {...props} style={{ color: '#fff8', fontWeight: '400', ...props.style }} />
