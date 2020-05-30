import React from 'react'
import { View } from 'react-native'
import SegmentedControlTab from 'react-native-segmented-control-tab'

const color = '#405147'

export default ({ toggleView, viewIndex }: { toggleView: (index: number) => void; viewIndex: number }) => (
  <View
    style={{
      marginBottom: 20,
      marginHorizontal: 36,
      marginTop: 25,
    }}
  >
    <SegmentedControlTab
      activeTabOpacity={0.7}
      activeTabStyle={{ backgroundColor: '#fff6' }}
      activeTabTextStyle={{ color: '#181f1a', fontWeight: '700' }}
      onTabPress={toggleView}
      selectedIndex={viewIndex}
      tabStyle={{ backgroundColor: color + '33', borderColor: '#fff2' }}
      tabTextStyle={{ color: '#fff7' }}
      values={['Bar', 'Calendar', 'List']}
    />
  </View>
)
