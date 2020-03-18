import CountdownScreen from './CountdownScreen/CountdownScreen'
import HistoryScreen from './HistoryScreen/HistoryScreen'
import MultiDeleteScreen from './HistoryScreen/MultiDeleteScreen'
import InitFriendsScreen from './InitFriendsScreen'
import InitQuestionScreen from './InitQuestionScreen'
import MainScreen from './MainScreen/MainScreen'
import CheckContactsScreen from './SettingsScreen/Friends/CheckContactsScreen'
import SettingsScreen from './SettingsScreen/SettingsScreen'

export default {
  CheckContactsScreen,
  CountdownScreen,
  HistoryScreen,
  InitFriendsScreen,
  InitQuestionScreen,
  MainScreen,
  MultiDeleteScreen,
  SettingsScreen,
}

export type ScreenNames =
  | 'CountdownScreen'
  | 'HistoryScreen'
  | 'MainScreen'
  | 'SettingsScreen'
  | 'MultiDeleteScreen'
  | 'InitQuestionScreen'
  | 'CheckContactsScreen'
  | 'InitFriendsScreen'
