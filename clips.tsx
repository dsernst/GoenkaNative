import { Alert } from 'react-native'
import Sound from 'react-native-sound'

function showErrors(error: string) {
  if (error) {
    Alert.alert('failed to load the sound', error)
  }
}

Sound.setCategory('Playback')

const clips = {
  closingChanting: new Sound('closing-chanting.mp3', Sound.MAIN_BUNDLE, showErrors),
  closingMetta: new Sound('closing-metta.mp3', Sound.MAIN_BUNDLE, showErrors),
  extendedMetta: new Sound('extended-metta.mp3', Sound.MAIN_BUNDLE, showErrors),
  introChanting: new Sound('intro-chanting.mp3', Sound.MAIN_BUNDLE, showErrors),
  introInstructions: new Sound('intro-instructions.mp3', Sound.MAIN_BUNDLE, showErrors),
}

export { clips, Sound }
