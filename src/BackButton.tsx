import React from 'react'
import { Text, TouchableOpacity } from 'react-native'
import { connect } from 'react-redux'

const BackButton = ({
  color = '#fff3',
  onPress,
  saveSpace,
  switchScreen,
  text,
}: {
  color?: string
  onPress?: () => void
  saveSpace?: boolean
  switchScreen: any
  text?: string
}) => (
  <TouchableOpacity
    onPress={onPress ? () => onPress() : () => switchScreen('InitScreen')}
    style={{
      alignItems: 'center',
      alignSelf: 'center',
      marginBottom: saveSpace ? 5 : 20,
      marginTop: 'auto',
      paddingBottom: saveSpace ? 36 : 40,
      paddingTop: 20,
      width: 200,
    }}
  >
    <Text style={{ color, fontSize: 18 }}>{text || 'Back'}</Text>
  </TouchableOpacity>
)

export default connect(
  () => ({}),
  dispatch => ({ switchScreen: (screen: string) => dispatch({ payload: { screen }, type: 'SET_STATE' }) }),
)(BackButton)
