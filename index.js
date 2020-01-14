/**
 * @format
 */

import React from 'react'
import { AppRegistry } from 'react-native'
import App from './App'
import { name as appName } from './app.json'
import { Provider } from 'react-redux'
import { createStore } from 'redux'
import reducer from './reducer'

const store = createStore(reducer)

const Reduxed = () => (
  <Provider store={store}>
    <App />
  </Provider>
)

AppRegistry.registerComponent(appName, () => Reduxed)
