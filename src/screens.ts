import CountdownScreen from './CountdownScreen/CountdownScreen'
import FriendsSitScreen from './FriendsSitScreen'
import HistoryScreen from './HistoryScreen/HistoryScreen'
import MultiDeleteScreen from './HistoryScreen/MultiDeleteScreen'
import InitFriendsScreen from './InitFriendsScreen'
import InitQuestionScreen from './InitQuestionScreen'
import MainScreen from './MainScreen/MainScreen'
import CheckContactsScreen from './SettingsScreen/Friends/CheckContactsScreen'
import SettingsScreen from './SettingsScreen/SettingsScreen'

const screens = {
  CheckContactsScreen,
  CountdownScreen,
  FriendsSitScreen,
  HistoryScreen,
  InitFriendsScreen,
  InitQuestionScreen,
  MainScreen,
  MultiDeleteScreen,
  SettingsScreen,
}

export type ScreenNames = keyof typeof screens

export default screens
