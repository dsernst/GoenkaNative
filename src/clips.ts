import { Alert } from 'react-native'
import Sound from 'react-native-sound'

// Extend Sound to store delays
export class SoundPlus extends Sound {
  length: number = 0
  volume: number = 1
}

// Category: 'Playback' — Required for Sounds to be playable while iOS is in Vibrate mode
// mixWithOthers: true — Allow other audio apps to play at the same time
Sound.setCategory('Playback', true)

// Helper function so we don't have to repeat bundle or errHandler
function clip(filename: string, delay: number = 0, volume: number = 1) {
  const c = new SoundPlus(filename, Sound.MAIN_BUNDLE, (error: string) => {
    if (error) {
      Alert.alert('Failed to load the sound', JSON.stringify(error))
    } else {
      c.length = Math.floor(c.getDuration()) + delay
      c.volume = volume
    }
  })

  return c
}

// Load in our clips w/ desired delays (seconds) before starting next clip
const clips: { [key: string]: SoundPlus } = {
  closingChanting: clip('closingchanting.mp3', 3, 0.5),
  closingGood: clip('closinggood.mp3', 0),
  closingMetta: clip('closingmetta.mp3', 0, 0.3),
  extendedMetta: clip('extendedmetta.mp3', 10),
  introChanting: clip('introchanting.mp3', 5),
  introInstructions: clip('introinstructions.mp3', 1),
}

export default clips
