import _ from 'lodash'
import React from 'react'
import { View } from 'react-native'

export default ({
  barWidth,
  eveningPurple,
  morningYellow,
  range,
  selected,
}: {
  barWidth: { width: number }
  eveningPurple: string
  morningYellow: string
  range: string
  selected?: string
}) => {
  return (
    <View style={[barWidth, { flexDirection: 'row', justifyContent: 'space-between' }]}>
      {range === selected &&
        _.range(4).map(i => (
          <View
            key={i}
            style={{
              borderColor: range[range.length - 2] === 'a' ? morningYellow : eveningPurple,
              borderWidth: 1.5,
              marginBottom: -1,
              marginRight: 1,
            }}
          />
        ))}
    </View>
  )
}
