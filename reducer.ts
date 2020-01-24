import Sound from 'react-native-sound'
import { SitProps } from './HistoryScreen'
import { Animated } from 'react-native'

export type ScreenNames = 'InitScreen' | 'CountdownScreen' | 'HistoryScreen'

export type State = {
  duration: number
  finished: boolean
  hasChanting: boolean
  hasExtendedMetta: boolean
  history: SitProps[]
  isEnoughTime: boolean
  latestTrack: Sound | null
  screen: ScreenNames
  showHistoryBtnTooltip: boolean
  titleOpacity: Animated.Value
}

const initialState: State = {
  duration: 60,
  finished: false,
  hasChanting: true,
  hasExtendedMetta: false,
  history: [],
  isEnoughTime: true,
  latestTrack: null,
  screen: 'InitScreen',
  showHistoryBtnTooltip: false,
  titleOpacity: new Animated.Value(1),
}

type Action = {
  payload: object
  type: 'setState'
}

const reducer = (state = initialState, action: Action): State => {
  switch (action.type) {
    case 'setState':
      return { ...state, ...action.payload }
    default:
      return state
  }
}

export default reducer
