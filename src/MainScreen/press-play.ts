import { Animated, Easing } from 'react-native'
import Sound from 'react-native-sound'

import c from '../clips'
import { Props } from '../reducer'
import firstSitInstructions from './first-sit-instruction'

async function pressPlay({ duration, hasChanting, hasExtendedMetta, history, setState, titleOpacity }: Props) {
  // Show instructions if this is their first sit
  if (!history.length) {
    await firstSitInstructions()
  }

  // Required for Sounds to be playable while iOS is in Vibrate mode
  Sound.setCategory('Playback')

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

  // Calculate closing time
  const closingMettaTime = (duration * 60 - c.closingMetta.length) * 1000

  let extendedMettaTime = closingMettaTime
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

  // Begin closingMetta so it ends when countdown hits zero.
  timeouts.push(
    setTimeout(() => {
      setState({ latestTrack: c.closingMetta.setVolume(0.5) })
    }, closingMettaTime),
  )
  setState({ timeouts })
}

export default pressPlay
