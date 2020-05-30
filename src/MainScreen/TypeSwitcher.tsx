import React from 'react'
import { View } from 'react-native'
import SegmentedControlTab from 'react-native-segmented-control-tab'

const backgroundColor = '#001709'

export default ({ selectView, viewIndex }: { selectView: (index: number) => void; viewIndex: number }) => (
  <View
    style={{
      borderColor: '#0000',
      borderTopColor: '#40514758',
      borderWidth: 1,
      marginBottom: 20,
      marginTop: -25,
    }}
  >
    <SegmentedControlTab
      activeTabStyle={{ backgroundColor }}
      activeTabTextStyle={{ color: '#fff7' }}
      onTabPress={idx => [0, 3].includes(idx) && selectView(idx)}
      selectedIndex={viewIndex}
      tabStyle={{ backgroundColor: '#40514718', borderColor: '#0000' }}
      tabTextStyle={{ color: '#fff4', fontSize: 13 }}
      values={['Custom', '', ' ', 'Recordings']}
    />
  </View>
)
