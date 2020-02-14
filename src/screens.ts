import CountdownScreen from './CountdownScreen/CountdownScreen'
import FirstOpenQuestionScreen from './FirstOpenQuestionScreen'
import HistoryScreen from './HistoryScreen/HistoryScreen'
import MultiDeleteScreen from './HistoryScreen/MultiDeleteScreen'
import MainScreen from './MainScreen/MainScreen'
import SettingsScreen from './SettingsScreen/SettingsScreen'
import SyncScreen from './SettingsScreen/SyncScreen/SyncScreen'

export default {
  CountdownScreen,
  FirstOpenQuestionScreen,
  HistoryScreen,
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
  | 'FirstOpenQuestionScreen'
