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
import { createTransform, persistReducer, persistStore } from 'redux-persist'
import AsyncStorage from '@react-native-community/async-storage'
import { PersistGate } from 'redux-persist/integration/react'

const store = createStore(
  persistReducer(
    {
      key: 'root',
      storage: AsyncStorage,

      // Transform dates back into JS Dates on rehydrate
      // (see: https://github.com/rt2zz/redux-persist/issues/82)
      transforms: [
        createTransform(JSON.stringify, toRehydrate =>
          JSON.parse(toRehydrate, (key, value) =>
            typeof value === 'string' && value.match(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/)
              ? new Date(value)
              : value,
          ),
        ),
      ],

      whitelist: [
        'history',
        'duration',
        'hasChanting',
        'hasExtendedMetta',
        'isEnoughTime',
        'amNotification',
        'amNotificationTime',
        'pmNotification',
        'pmNotificationTime',
      ],
    },
    reducer,
  ),
)

const Reduxed = () => (
  <Provider store={store}>
    <PersistGate persistor={persistStore(store)}>
      <App />
    </PersistGate>
  </Provider>
)

AppRegistry.registerComponent(appName, () => Reduxed)
