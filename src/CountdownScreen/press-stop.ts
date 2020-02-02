import { Animated } from 'react-native'

import { Props } from '../reducer'

export default ({ history, latestTrack, setState, timeouts, titleOpacity }: Props) => {
  // Fade in title
  Animated.timing(titleOpacity, {
    toValue: 1,
  }).start()

  // Stop audio
  if (latestTrack) {
    latestTrack.stop()
  }

  // Clear all of the setTimeouts
  const newTimeouts = [...timeouts]
  let t = newTimeouts.pop()
  while (t) {
    clearTimeout(t)
    t = newTimeouts.pop()
  }
  setState({ timeouts: newTimeouts })

  // Go back to InitScreen
  setState({ finished: false, latestTrack: null, screen: 'InitScreen' })

  // Turn on HistoryBtnTooltip if this was their first sit
  if (history.length === 1) {
    setTimeout(() => {
      setState({ showHistoryBtnTooltip: true })
    }, 500)
  }
}
