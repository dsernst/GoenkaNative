import React, {useState} from 'react';
import {Alert} from 'react-native';

import {Props} from './reducer';

function InitQuestionScreen({isOldStudent, setState}: Props) {
  const [shownPrompt, setShownPrompt] = useState(false);

  const NextScreen = 'InitFriendsScreen';

  if (isOldStudent !== null || process.env.NODE_ENV === 'development') {
    setState({screen: NextScreen});
  } else if (!shownPrompt) {
    setShownPrompt(true);
    Alert.alert(
      'Welcome',
      'Have you completed a Vipassana course taught by S.N. Goenka?\n\nThis does not affect functionality.',
      [
        {
          onPress: () => {
            Alert.alert(
              'Welcome, fellow meditator',
              'For help and/or questions, email: hi@goenka.app',
              [
                {
                  onPress: () =>
                    setState({isOldStudent: true, screen: NextScreen}),
                  text: 'OK',
                },
              ],
            );
          },
          text: 'Yes',
        },
        {
          onPress: () => {
            Alert.alert(
              'Welcome',
              `You are still welcome to use this app, but it was designed for Old Students and may not be as useful for you until you complete a 10-day Vipassana meditation course.

The courses are free — including food, housing, & instruction — and run by volunteers at hundreds of locations around the world.

Visit dhamma.org for more information.

For help and/or questions with this app, email hi@goenka.app`,
              [
                {
                  onPress: () =>
                    setState({isOldStudent: false, screen: NextScreen}),
                  text: 'OK',
                },
              ],
            );
          },
          style: 'destructive',
          text: 'No',
        },
      ],
    );
  }

  return <></>;
}

export default InitQuestionScreen;
