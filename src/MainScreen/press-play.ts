import { Animated, Easing } from 'react-native'
import SystemSetting from 'react-native-system-setting'

import c from '../clips'
import { Props } from '../reducer'
import setDailyNotifications from '../SettingsScreen/notification'
import firstSitInstructions from './first-sit-instruction'
import { Recording } from './Recordings'

async function pressPlay(props: Props, recording?: Recording) {
  const {
    airplaneModeReminder,
    airplaneModeReminderOpacity,
    amNotification,
    amNotificationTime,
    duration,
    hasChanting,
    hasExtendedMetta,
    history,
    pmNotification,
    pmNotificationTime,
    setState,
    titleOpacity,
  } = props

  // Reminder to turn on Airplane mode, if requested && not currently on
  if (airplaneModeReminder && !(await SystemSetting.isAirplaneEnabled())) {
    // Show reminder, then fade out
    Animated.sequence([
      Animated.timing(airplaneModeReminderOpacity, { toValue: 0.8 }),
      Animated.delay(2500),
      Animated.timing(airplaneModeReminderOpacity, { duration: 1000, easing: Easing.linear, toValue: 0 }),
    ]).start()
  }

  // Show instructions if this is their first sit
  if (!history.length) {
    await firstSitInstructions()
  }

  // Switch screens
  setState({ screen: 'CountdownScreen' })

  // Fade out title
  Animated.timing(titleOpacity, {
    duration: 5000,
    easing: Easing.linear,
    toValue: 0.1,
  }).start()

  // Add to history
  const newHistory = [{ date: new Date(), duration: duration, elapsed: 0, hasChanting, hasExtendedMetta }, ...history]
  setState({ history: newHistory })
  // Update daily notifications
  setDailyNotifications(amNotification, amNotificationTime, pmNotification, pmNotificationTime, newHistory)

  // If not called w/ `recording` param, queue up custom clips
  if (!recording) {
    setupCustomSoundClips(props)
  } else {
    setState({ latestTrack: recording.sound })
  }
}

function setupCustomSoundClips({ duration, hasChanting, hasExtendedMetta, setState }: Props) {
  const timeouts = []
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

  // If < 6 min sit, use short "good, good" clip
  // Otherwise "Bhavatu Sabba Mangalam"
  const closingClip = duration < 6 ? c.closingGood : c.closingMetta

  const closingClipTime = (duration * 60 - closingClip.length) * 1000

  let extendedMettaTime = closingClipTime
  if (hasExtendedMetta) {
    // Begin extendedMetta so it ends just before closingMetta
    extendedMettaTime -= c.extendedMetta.length * 1000

    timeouts.push(
      setTimeout(() => {
        setState({ latestTrack: c.extendedMetta })
      }, extendedMettaTime),
    )
  }

  if (hasChanting) {
    // Begin closingChanting so it ends just before metta starts.
    timeouts.push(
      setTimeout(() => {
        setState({ latestTrack: c.closingChanting })
      }, extendedMettaTime - c.closingChanting.length * 1000),
    )
  }

  // Begin closingClip so it ends when countdown hits zero.
  timeouts.push(
    setTimeout(() => {
      setState({ latestTrack: closingClip })
    }, closingClipTime),
  )
  setState({ timeouts })
}

export default pressPlay
