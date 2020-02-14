import { Alert } from 'react-native'

const firstSitInstructions = async () =>
  await new Promise(resolve =>
    Alert.alert(
      'First time instructions:',
      `
1) Leave the app open to keep the timer running.

2) Your phone won't auto-lock while the timer is running.

3) Work diligently, work intelligently, work patiently and persistently.

ツ`,
      [{ onPress: resolve, text: 'OK' }],
    ),
  )

export default firstSitInstructions
