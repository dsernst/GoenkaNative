import { Animated, Easing } from 'react-native'

import c from '../clips'
import { Props } from '../reducer'
import firstSitInstructions from './first-sit-instruction'

async function pressPlay({ duration, hasChanting, hasExtendedMetta, history, setState, titleOpacity }: Props) {
  // Show instructions if this is their first sit
  if (!history.length) {
    await firstSitInstructions()
  }

  const timeouts = []
  // Switch screens
  setState({ screen: 'CountdownScreen' })

  // Fade out title
  Animated.timing(titleOpacity, {
    duration: 5000,
    easing: Easing.linear,
    toValue: 0.1,
  }).start()

  // Add to history
  setState({
    history: [{ date: new Date(), duration: duration, elapsed: 0, hasChanting, hasExtendedMetta }, ...history],
  })

  if (hasChanting) {
    // Begin introChanting
    setState({ latestTrack: c.introChanting })

    // Setup a timeout to begin introInstructions a few
    // seconds after introChanting finishes.
    timeouts.push(
      setTimeout(() => {
        setState({ latestTrack: c.introInstructions })
      }, c.introChanting.length * 1000),
    )
  } else {
    setState({ latestTrack: c.introInstructions })
  }

  //
  // Calculate closing time
  //

  // If < 4 min sit, use short "good, good" clip
  // Otherwise "Bhavatu Sabba Mangalam"
  const closingClip = duration < 6 ? c.closingGood : c.closingMetta

  const closingClipTime = (duration * 60 - closingClip.length) * 1000

  let extendedMettaTime = closingClipTime
  if (hasExtendedMetta) {
    // Begin extendedMetta so it ends just before closingMetta
    extendedMettaTime -= c.extendedMetta.length * 1000

    timeouts.push(
      setTimeout(() => {
        setState({ latestTrack: c.extendedMetta.setVolume(1) })
      }, extendedMettaTime),
    )
  }

  if (hasChanting) {
    // Begin closingChanting so it ends just before metta starts.
    timeouts.push(
      setTimeout(() => {
        setState({ latestTrack: c.closingChanting.setVolume(0.5) })
      }, extendedMettaTime - c.closingChanting.length * 1000),
    )
  }

  // Begin closingClip so it ends when countdown hits zero.
  timeouts.push(
    setTimeout(() => {
      setState({ latestTrack: closingClip.setVolume(0.4) })
    }, closingClipTime),
  )
  setState({ timeouts })
}

export default pressPlay
