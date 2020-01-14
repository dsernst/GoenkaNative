import { Sound } from './clips'
import { SitProps } from './HistoryScreen'

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
}

const initialState: State = {
  duration: 60,
  finished: false,
  hasChanting: false,
  hasExtendedMetta: false,
  history: [
    {
      date: new Date('Sat Jan 13 2020 9:14'),
      duration: 15,
      elapsed: 15,
    },
    {
      date: new Date('Sun Jan 12 2020 22:58'),
      duration: 45,
      elapsed: 45,
    },
    {
      date: new Date('Sun Jan 12 2020 12:50'),
      duration: 5,
      elapsed: 5,
    },
    {
      date: new Date('Sat Jan 11 2020 11:57'),
      duration: 60,
      elapsed: 60,
    },
    {
      date: new Date('Fri Jan 10 2020 22:30'),
      duration: 10,
      elapsed: 10,
    },
    {
      date: new Date('Fri Jan 10 2020 8:25'),
      duration: 35,
      elapsed: 35,
    },
  ],
  isEnoughTime: true,
  latestTrack: null,
  screen: 'InitScreen',
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
