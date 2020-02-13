import React from 'react'
import { View } from 'react-native'
import SegmentedControlTab from 'react-native-segmented-control-tab'

const color = '#405147'

export default ({ toggleView, viewIndex }: { toggleView: (index: number) => void; viewIndex: number }) => (
  <View
    style={{
      marginBottom: 5,
      marginHorizontal: 30,
      paddingVertical: 15,
    }}
  >
    <SegmentedControlTab
      activeTabOpacity={0.7}
      activeTabStyle={{ backgroundColor: '#fffa' }}
      activeTabTextStyle={{ color: color, fontWeight: '700' }}
      onTabPress={toggleView}
      selectedIndex={viewIndex}
      tabStyle={{ backgroundColor: color + '33', borderColor: '#fff3' }}
      tabTextStyle={{ color: '#fff7' }}
      values={['Bar', 'Calendar', 'List']}
    />
  </View>
)
