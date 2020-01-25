import Sound from 'react-native-sound'
import { Animated } from 'react-native'

export type SitProps = {
  date: Date
  duration: number
  elapsed: number
  hasChanting?: boolean
  hasExtendedMetta?: boolean
}

export type ScreenNames = 'InitScreen' | 'CountdownScreen' | 'HistoryScreen'

type ToggleableStates = {
  finished: boolean
  hasChanting: boolean
  hasExtendedMetta: boolean
  isEnoughTime: boolean
  showHistoryBtnTooltip: boolean
}

export interface State extends ToggleableStates {
  duration: number
  history: SitProps[]
  latestTrack: Sound | null
  screen: ScreenNames
  timeouts: ReturnType<typeof setTimeout>[]
  titleOpacity: Animated.Value
}

export type Toggleables = keyof ToggleableStates

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
