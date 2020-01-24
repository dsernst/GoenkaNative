import Sound from 'react-native-sound'
import { Animated } from 'react-native'

export type SitProps = {
  date: Date
  duration: number
  elapsed: number
}

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
  timeouts: ReturnType<typeof setTimeout>[]
  titleOpacity: Animated.Value
}

export type Toggleables = 'finished' | 'hasChanting' | 'hasExtendedMetta' | 'showHistoryBtnTooltip'

export type setStatePayload = Partial<State>

export interface Props extends State {
  setState: (payload: setStatePayload) => void
  toggle: (key: Toggleables) => () => void
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
  timeouts: [],
  titleOpacity: new Animated.Value(1),
}

type Action =
  | {
      payload: Partial<State>
      type: 'SET_STATE'
    }
  | {
      key: Toggleables
      type: 'TOGGLE'
    }

const reducer = (state = initialState, action: Action): State => {
  switch (action.type) {
    case 'SET_STATE':
      return { ...state, ...action.payload }
    case 'TOGGLE':
      return {
        ...state,
        ...{
          [action.key]: !state[action.key],
        },
      }
    default:
      return state
  }
}

export default reducer
