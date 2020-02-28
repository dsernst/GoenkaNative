import { FirebaseAuthTypes } from '@react-native-firebase/auth'
import { Animated } from 'react-native'
import { Contact } from 'react-native-contacts'
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

export type FriendRequest = {
  accepted?: Date
  created_at: Date
  from_name: string
  from_onesignal_id: string
  from_phone: string
  from_wants_notifs: boolean
  id: string
  rejected?: Date
  to_name: string
  to_onesignal_id: string
  to_phone: string
  to_wants_notifs: boolean
}

type OnlineSit = Sit & { id: string; user_id: string; user_phone?: string }

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

type ContactType = 'alreadyFriends' | 'availableToFriend' | 'notOnApp' | 'pendingRequests'
export type ContactWithType = Contact & { checking?: boolean; type?: ContactType }

export interface State extends ToggleableStates {
  acceptedIncomingFriendRequests: FriendRequest[]
  acceptedOutgoingFriendRequests: FriendRequest[]
  amNotificationTime: Date
  backgroundColor: string
  contacts?: ContactWithType[]
  displayName: string | null
  duration: number
  expandFriendsSection?: boolean
  history: Sit[]
  historyViewIndex: number
  incomingFriendRequests: FriendRequest[]
  isOldStudent: boolean | null
  latestTrack: Sound | null
  notifications_allowed: boolean
  onesignal_id: string | null
  onlineSits: OnlineSit[]
  outgoingFriendRequests: FriendRequest[]
  pmNotificationTime: Date
  rejectedFriendRequests: FriendRequest[]
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
  acceptedIncomingFriendRequests: [],
  acceptedOutgoingFriendRequests: [],
  amNotification: false,
  amNotificationTime: new Date('Jan 1, 2020 08:00 AM'),
  autoSyncCompletedSits: true,
  backgroundColor: '#001709',
  displayName: null,
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
  notifications_allowed: false,
  onesignal_id: null,
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
