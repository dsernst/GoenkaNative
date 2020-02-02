import React from 'react'
import { TouchableOpacity } from 'react-native'
import SegmentedControlTab from 'react-native-segmented-control-tab'

const color = '#405147'

export default ({ toggleView, viewIndex }: { toggleView: () => void; viewIndex: number }) => (
  <TouchableOpacity
    activeOpacity={1}
    onPress={() => toggleView()}
    style={{
      marginBottom: 5,
      marginHorizontal: 30,
      paddingHorizontal: 30,
      paddingVertical: 15,
    }}
  >
    <SegmentedControlTab
      activeTabStyle={{ backgroundColor: '#fffa' }}
      activeTabTextStyle={{ color: color, fontWeight: '700' }}
      onTabPress={() => toggleView()}
      selectedIndex={viewIndex}
      tabStyle={{ backgroundColor: color + '33', borderColor: '#fff3' }}
      tabTextStyle={{ color: '#fff7' }}
      values={['List', 'Calendar']}
    />
  </TouchableOpacity>
)
