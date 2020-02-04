import { Alert } from 'react-native'
import Sound from 'react-native-sound'

// Extend Sound to store delays
export class SoundWithDelay extends Sound {
  length: number = 0
}

// Helper function so we don't have to repeat bundle or errHandler
function clip(filename: string, delay: number = 0) {
  const c = new SoundWithDelay(filename, Sound.MAIN_BUNDLE, function showErrors(error: string) {
    if (error) {
      Alert.alert('Failed to load the sound', JSON.stringify(error))
    } else {
      c.length = Math.floor(c.getDuration()) + delay
    }
  })

  return c
}

// Load in our clips w/ desired delays (seconds) before starting next clip
const clips: { [key: string]: SoundWithDelay } = {
  closingChanting: clip('closingchanting.mp3', 2),
  closingMetta: clip('closingmetta.mp3'),
  extendedMetta: clip('extendedmetta.mp3', 1),
  introChanting: clip('introchanting.mp3', 5),
  introInstructions: clip('introinstructions.mp3', 1),
}

export default clips
