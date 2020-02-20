import React, { useState } from 'react'
import { Text, TouchableOpacity, View } from 'react-native'
import Octicons from 'react-native-vector-icons/Octicons'
import { connect } from 'react-redux'

import { Props, State, Toggleables, setStatePayload } from '../reducer'

type SectionProps = Props & {
  Content: (props: Props) => JSX.Element
  icon: { Set: typeof Octicons; name: string; size: number }
  title: string
}

function Section(props: SectionProps) {
  const { Content, icon, title } = props
  const [enabled, setEnabled] = useState(false)
  const { Set } = icon

  return (
    <View style={{ marginBottom: enabled ? 50 : 30 }}>
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => setEnabled(!enabled)}
        style={{
          alignItems: 'center',
          alignSelf: 'center',
          borderColor: '#fff1',
          borderRadius: 8,
          borderWidth: 1,
          flexDirection: 'row',
          height: 38,
          marginBottom: enabled ? 20 : 0,
          paddingHorizontal: 15,
          width: '100%',
        }}
      >
        <View style={{ alignItems: 'center', marginRight: 10, width: 25 }}>
          <Set color="#fffa" {...icon} style={{ paddingTop: 2 }} />
        </View>
        <Text style={{ color: '#fff9', fontSize: 16 }}>{title}</Text>

        <Octicons
          color="#fff5"
          name={enabled ? 'chevron-down' : 'chevron-right'}
          size={18}
          style={{ marginLeft: 'auto', paddingTop: 3 }}
        />
      </TouchableOpacity>
      <View style={{ paddingHorizontal: 18 }}>{enabled && <Content {...props} />}</View>
    </View>
  )
}

export default connect(
  (s: State) => s,

  // Map dispatch into setState prop
  dispatch => ({
    setState: (payload: setStatePayload) => dispatch({ payload, type: 'SET_STATE' }),
    toggle: (key: Toggleables) => () => dispatch({ key, type: 'TOGGLE' }),
  }),
)(Section)
