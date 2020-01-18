import { Alert } from 'react-native'
import Sound from 'react-native-sound'

// Required for Sounds to be playable
Sound.setCategory('Playback')

// Extend Sound to store delays
export class SoundWithDelay extends Sound {
  length: number = 0
}

// Helper function so we don't have to repeat bundle or errHandler
const clip = (filename: string, delay: number = 0) => {
  const c = new SoundWithDelay(filename, Sound.MAIN_BUNDLE, function showErrors(error: string) {
    if (error) {
      Alert.alert('Failed to load the sound', error)
    } else {
      c.length = Math.ceil(c.getDuration()) + delay
    }
  })
  return c
}

// Load in our clips w/ desired delays (seconds) before starting next clip
const clips: { [key: string]: SoundWithDelay } = {
  closingChanting: clip('closing-chanting.mp3', 2),
  closingMetta: clip('closing-metta.mp3'),
  extendedMetta: clip('extended-metta.mp3', 15),
  introChanting: clip('intro-chanting.mp3', 5),
  introInstructions: clip('intro-instructions.mp3'),
}

export default clips
