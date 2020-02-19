import CountdownScreen from './CountdownScreen/CountdownScreen'
import HistoryScreen from './HistoryScreen/HistoryScreen'
import MultiDeleteScreen from './HistoryScreen/MultiDeleteScreen'
import InitQuestionScreen from './InitQuestionScreen'
import MainScreen from './MainScreen/MainScreen'
import FriendsScreen from './SettingsScreen/FriendsScreen/FriendsScreen'
import SettingsScreen from './SettingsScreen/SettingsScreen'
import SyncScreen from './SettingsScreen/SyncScreen/SyncScreen'

export default {
  CountdownScreen,
  FriendsScreen,
  HistoryScreen,
  InitQuestionScreen,
  MainScreen,
  MultiDeleteScreen,
  SettingsScreen,
  SyncScreen,
}

export type ScreenNames =
  | 'CountdownScreen'
  | 'HistoryScreen'
  | 'MainScreen'
  | 'SettingsScreen'
  | 'MultiDeleteScreen'
  | 'SyncScreen'
  | 'InitQuestionScreen'
  | 'FriendsScreen'
