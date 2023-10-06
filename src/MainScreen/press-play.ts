import {Animated, Easing} from 'react-native';
import SystemSetting from 'react-native-system-setting';

import c from '../clips';
import {Props, Sit} from '../reducer';
import setDailyNotifications from '../SettingsScreen/notification';
import firstSitInstructions from './first-sit-instruction';
import {Recording} from './Recordings';

async function pressPlay(props: Props, recording?: Recording) {
  const {
    airplaneModeReminder,
    airplaneModeReminderOpacity,
    amNotification,
    amNotificationTime,
    customDuration,
    hasChanting,
    hasExtendedMetta,
    history,
    pmNotification,
    pmNotificationTime,
    setState,
    titleOpacity,
  } = props;

  // Reminder to turn on Airplane mode, if requested && not currently on
  if (airplaneModeReminder && !(await SystemSetting.isAirplaneEnabled())) {
    // Show reminder, then fade out
    Animated.sequence([
      Animated.timing(airplaneModeReminderOpacity, {
        toValue: 0.8,
        useNativeDriver: false,
      }),
      Animated.delay(2500),
      Animated.timing(airplaneModeReminderOpacity, {
        duration: 1000,
        easing: Easing.linear,
        toValue: 0,
        useNativeDriver: false,
      }),
    ]).start();
  }

  // Show instructions if this is their first sit
  if (!history.length) {
    await firstSitInstructions();
  }

  // Fade out title
  Animated.timing(titleOpacity, {
    duration: 5000,
    easing: Easing.linear,
    toValue: 0.1,
    useNativeDriver: false,
  }).start();

  let newSit: Sit = {
    date: new Date(),
    duration: customDuration,
    elapsed: 0,
  };

  // If not called w/ `recording` param, queue up custom clips
  if (!recording) {
    enqueueCustomSoundClips(props);
    newSit = {
      ...newSit,
      hasChanting,
      hasExtendedMetta,
    };
  } else {
    const [hours, minutes] = recording.duration.split(':').map(Number);
    const durationInMin = hours * 60 + minutes;
    newSit = {
      ...newSit,
      duration: durationInMin,
      recording: recording.filename,
    };

    setState({
      countdownDuration: durationInMin,
      latestTrack: recording.sound,
    });
  }

  // Add to history
  const newHistory = [newSit, ...history];
  setState({history: newHistory});
  // Update daily notifications
  setDailyNotifications(
    amNotification,
    amNotificationTime,
    pmNotification,
    pmNotificationTime,
    newHistory,
  );

  // Switch screens
  setState({screen: 'CountdownScreen'});
}

//
//
// Calculate & enqueue custom audio preferences
function enqueueCustomSoundClips({
  customDuration,
  hasChanting,
  hasExtendedMetta,
  setState,
}: Props) {
  setState({countdownDuration: customDuration});

  const timeouts = [];
  if (hasChanting) {
    // Begin introChanting
    setState({latestTrack: c.introChanting});

    // Setup a timeout to begin introInstructions a few
    // seconds after introChanting finishes.
    timeouts.push(
      setTimeout(() => {
        setState({latestTrack: c.introInstructions});
      }, c.introChanting.length * 1000),
    );
  } else {
    setState({latestTrack: c.introInstructions});
  }

  //
  // Calculate closing time
  //

  // If < 6 min sit, use short "good, good" clip
  // Otherwise "Bhavatu Sabba Mangalam"
  const closingClip = customDuration < 6 ? c.closingGood : c.closingMetta;

  const closingClipTime = (customDuration * 60 - closingClip.length) * 1000;

  let extendedMettaTime = closingClipTime;
  if (hasExtendedMetta) {
    // Begin extendedMetta so it ends just before closingMetta
    extendedMettaTime -= c.extendedMetta.length * 1000;

    timeouts.push(
      setTimeout(() => {
        setState({latestTrack: c.extendedMetta});
      }, extendedMettaTime),
    );
  }

  if (hasChanting) {
    // Begin closingChanting so it ends just before metta starts.
    timeouts.push(
      setTimeout(() => {
        setState({latestTrack: c.closingChanting});
      }, extendedMettaTime - c.closingChanting.length * 1000),
    );
  }

  // Begin closingClip so it ends when countdown hits zero.
  timeouts.push(
    setTimeout(() => {
      setState({latestTrack: closingClip});
    }, closingClipTime),
  );
  setState({timeouts});
}

export default pressPlay;
