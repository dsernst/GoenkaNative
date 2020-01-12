import React, { useState } from 'react'
import { Animated } from 'react-native'

const bodyTextColor = '#f1f1f1'

export default () => {
  const [fadeAnim] = useState(new Animated.Value(0))

  React.useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(fadeAnim, {
          duration: 4000,
          toValue: 0.8,
        }),
        Animated.timing(fadeAnim, {
          duration: 3000,
          toValue: 0,
        }),
      ]),
    ).start()
  }, [fadeAnim])

  return (
    <Animated.Text
      style={{
        alignSelf: 'center',
        color: bodyTextColor,
        fontFamily: 'Palatino',
        fontSize: 30,
        fontStyle: 'italic',
        fontWeight: '400',
        marginTop: 45,
        opacity: fadeAnim,
      }}
    >
      Be happy
    </Animated.Text>
  )
}
