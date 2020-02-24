import React, { useState } from 'react'
import { Text, TouchableOpacity, View } from 'react-native'
import Octicons from 'react-native-vector-icons/Octicons'
import { connect } from 'react-redux'

import { Props, State, Toggleables, setStatePayload } from '../reducer'
import LoginFlow from './LoginFlow'

type SectionProps = Props & {
  Content: (props: any) => JSX.Element
  badgeNumber?: number
  description: string
  icon: { Set: typeof Octicons; name: string; size: number }
  requiresLogin?: boolean
  title: string
}

function Section(props: SectionProps) {
  const { Content, badgeNumber, description, icon, requiresLogin, title, user } = props
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
          borderColor: enabled ? '#9CDCFE55' : '#fff1',
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
          <Set color={enabled ? '#fffd' : '#fff8'} {...icon} style={{ paddingTop: 2 }} />
        </View>
        <Text style={{ color: enabled ? '#fffd' : '#fff8', fontSize: 16 }}>{title}</Text>

        {!!badgeNumber && (
          <View
            style={{
              backgroundColor: `#f8ff70${enabled ? '' : '88'}`,
              borderRadius: 30,
              marginLeft: 15,
              paddingHorizontal: 5,
            }}
          >
            <Text style={{ color: '#000', fontWeight: '700' }}>{badgeNumber}</Text>
          </View>
        )}

        <Octicons
          color="#fff5"
          name={enabled ? 'chevron-down' : 'chevron-right'}
          size={18}
          style={{ marginLeft: 'auto', paddingTop: 3 }}
        />
      </TouchableOpacity>
      <View style={{ paddingHorizontal: 18 }}>
        {enabled && (
          <>
            {description && <Text style={{ color: '#fffa', fontWeight: '600', marginBottom: 30 }}>{description}</Text>}
            {requiresLogin && !user ? <LoginFlow {...props} /> : <Content {...props} />}
          </>
        )}
      </View>
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
