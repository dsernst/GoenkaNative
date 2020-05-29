import React from 'react'
import { View } from 'react-native'
import SegmentedControlTab from 'react-native-segmented-control-tab'

const color = '#405147'

export default ({ selectView, viewIndex }: { selectView: (index: number) => void; viewIndex: number }) => (
  <View
    style={{
      alignSelf: 'center',
      marginBottom: 30,
      marginTop: -15,
      width: 210,
    }}
  >
    <SegmentedControlTab
      activeTabOpacity={0.7}
      activeTabStyle={{ backgroundColor: '#fff2' }}
      activeTabTextStyle={{ color: '#fffa', fontWeight: '700' }}
      onTabPress={selectView}
      selectedIndex={viewIndex}
      tabStyle={{ backgroundColor: color + '33', borderColor: '#fff3' }}
      tabTextStyle={{ color: '#fff7' }}
      values={['Custom', 'Recordings']}
    />
  </View>
)
