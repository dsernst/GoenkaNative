import { FirebaseAuthTypes } from '@react-native-firebase/auth'
import { Animated } from 'react-native'
import Sound from 'react-native-sound'

import { ScreenNames } from './screens'

const INITIAL_SCREEN = 'InitQuestionScreen'

export type Sit = {
  date: Date
  duration: number
  elapsed: number
  hasChanting?: boolean
  hasExtendedMetta?: boolean
  selected?: boolean
}

export type PendingFriendRequest = {
  accepted?: Date
  created_at: Date
  from: string
  id: string
  rejected?: Date
  to_phone: string
  to_user_id: string
}

type OnlineSit = Sit & { id: string; user_id: string }

type ToggleableStates = {
  amNotification: boolean
  autoSyncCompletedSits: boolean
  finished: boolean
  hasChanting: boolean
  hasExtendedMetta: boolean
  isEnoughTime: boolean
  pmNotification: boolean
  showHistoryBtnTooltip: boolean
}

export interface State extends ToggleableStates {
  acceptedFriendRequests: PendingFriendRequest[]
  amNotificationTime: Date
  duration: number
  history: Sit[]
  historyViewIndex: number
  incomingFriendRequests: PendingFriendRequest[]
  isOldStudent: boolean | null
  latestTrack: Sound | null
  onlineSits: OnlineSit[]
  outgoingFriendRequests: PendingFriendRequest[]
  pmNotificationTime: Date
  rejectedFriendRequests: PendingFriendRequest[]
  safeAreaInsetBottom: number
  safeAreaInsetTop: number
  screen: ScreenNames
  timeouts: ReturnType<typeof setTimeout>[]
  titleOpacity: Animated.Value
  user: FirebaseAuthTypes.User | null
}

export type Toggleables = keyof ToggleableStates

export type setStatePayload = Partial<State>

export interface Props extends State {
  setState: (payload: setStatePayload) => void
  toggle: (key: Toggleables) => () => void
}

const initialState: State = {
  acceptedFriendRequests: [],
  amNotification: false,
  amNotificationTime: new Date('Jan 1, 2020 08:00 AM'),
  autoSyncCompletedSits: true,
  duration: 60,
  finished: false,
  hasChanting: true,
  hasExtendedMetta: false,
  history: [],
  historyViewIndex: 1,
  incomingFriendRequests: [],
  isEnoughTime: true,
  isOldStudent: null,
  latestTrack: null,
  onlineSits: [],
  outgoingFriendRequests: [],
  pmNotification: false,
  pmNotificationTime: new Date('Jan 1, 2020 08:15 PM'),
  rejectedFriendRequests: [],
  safeAreaInsetBottom: 0,
  safeAreaInsetTop: 18,
  screen: INITIAL_SCREEN,
  showHistoryBtnTooltip: false,
  timeouts: [],
  titleOpacity: new Animated.Value(1),
  user: null,
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
