import React from 'react'
import { Dimensions, Text, TouchableOpacity } from 'react-native'
import { connect } from 'react-redux'

const { height: screenHeight } = Dimensions.get('window')
const hasHomeButton = screenHeight > 800

const BackButton = ({
  onPress,
  saveSpace,
  switchScreen,
  text,
}: {
  onPress?: () => void
  saveSpace?: boolean
  switchScreen: any
  text?: string
}) => (
  <TouchableOpacity
    onPress={onPress ? () => onPress() : () => switchScreen('InitScreen')}
    style={{
      alignItems: 'center',
      marginTop: 'auto',
      marginVertical: saveSpace && !hasHomeButton ? 0 : 10,
      paddingBottom: saveSpace ? 30 : 50,
      paddingTop: saveSpace ? 5 : 15,
    }}
  >
    <Text style={{ color: '#fff3', fontSize: 18 }}>{text || 'Back'}</Text>
  </TouchableOpacity>
)

export default connect(
  () => ({}),
  dispatch => ({ switchScreen: (screen: string) => dispatch({ payload: { screen }, type: 'SET_STATE' }) }),
)(BackButton)
