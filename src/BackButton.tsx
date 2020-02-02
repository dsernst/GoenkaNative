import React from 'react'
import { Text, TouchableOpacity } from 'react-native'
import { connect } from 'react-redux'

const BackButton = ({ onPress, switchScreen, text }: { onPress?: () => void; switchScreen: any; text?: string }) => (
  <TouchableOpacity
    onPress={onPress ? () => onPress() : () => switchScreen('InitScreen')}
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
  dispatch => ({ switchScreen: (screen: string) => dispatch({ payload: { screen }, type: 'SET_STATE' }) }),
)(BackButton)
