import React from 'react'
import { Text, TouchableOpacity } from 'react-native'
import { connect } from 'react-redux'

const BackButton = ({ onPress, setState, text }: { onPress?: () => void; setState: any; text?: string }) => (
  <TouchableOpacity
    onPress={onPress ? () => onPress() : () => setState({ screen: 'InitScreen' })}
    style={{
      alignItems: 'center',
      marginTop: 'auto',
      marginVertical: 10,
      paddingBottom: 50,
      paddingTop: 15,
    }}
  >
    <Text style={{ color: '#fff3', fontSize: 18 }}>{text || 'Back'}</Text>
  </TouchableOpacity>
)

export default connect(
  () => ({}),
  dispatch => ({ setState: (payload: any) => dispatch({ payload, type: 'SET_STATE' }) }),
)(BackButton)
