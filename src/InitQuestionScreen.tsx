import React, { useState } from 'react'
import { Alert } from 'react-native'

import { Props } from './reducer'

function InitQuestionScreen({ isOldStudent, setState }: Props) {
  const [shownPrompt, setShownPrompt] = useState(false)

  if (isOldStudent !== null) {
    setState({ screen: 'MainScreen' })
  } else if (!shownPrompt) {
    setShownPrompt(true)
    Alert.alert('Welcome', 'Have you completed a Vipassana course taught by S.N. Goenka?', [
      {
        onPress: () => {
          Alert.alert('Welcome, fellow meditator', 'For help and/or questions, email: hi@goenka.app', [
            { onPress: () => setState({ isOldStudent: true, screen: 'MainScreen' }), text: 'OK' },
          ])
        },
        text: 'Yes',
      },
      {
        onPress: () => {
          Alert.alert(
            'Welcome',
            `You are still welcome to use this app, but it may not be as useful for you until you complete a 10-day Vipassana meditation course.

The courses are freely offered without charge, by Old Students who wish to share this technique with others.

Visit _dhamma.org_ for more information.

For help and/or questions with this app, email hi@goenka.app`,
            [{ onPress: () => setState({ isOldStudent: false, screen: 'MainScreen' }), text: 'OK' }],
          )
        },
        style: 'destructive',
        text: 'No',
      },
    ])
  }

  return <></>
}

export default InitQuestionScreen
