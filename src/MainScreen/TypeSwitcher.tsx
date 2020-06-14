import React from 'react'
import { Text, TouchableOpacity, View } from 'react-native'

const backgroundColor = '#001709'

export default ({ selectView, viewIndex }: { selectView: (index: number) => void; viewIndex: number }) => (
  <View
    style={{
      backgroundColor: '#40514705',
      borderColor: '#40514710',
      borderTopWidth: 1,
      borderWidth: 0,
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 15,
    }}
  >
    {['Custom', 'Recordings'].map((label, index) => (
      <TouchableOpacity
        activeOpacity={1}
        key={label}
        onPress={() => selectView(index)}
        style={[
          { borderColor: '#0000', borderTopWidth: 1, bottom: 1 },
          index === viewIndex && { backgroundColor, borderColor: '#40514760' },
        ]}
      >
        <Text
          style={{
            color: index === viewIndex ? '#fff7' : '#fff2',
            fontSize: 13,
            paddingHorizontal: 24,
            paddingVertical: 6,
          }}
        >
          {label}
        </Text>
      </TouchableOpacity>
    ))}
  </View>
)
