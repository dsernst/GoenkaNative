import AsyncStorage from '@react-native-async-storage/async-storage';
import React from 'react';
import {Provider} from 'react-redux';
import {createStore} from 'redux';
import {createTransform, persistReducer, persistStore} from 'redux-persist';
import {PersistGate} from 'redux-persist/integration/react';
import {SafeAreaProvider} from 'react-native-safe-area-context';

import App from './App';
import reducer from './reducer';

const store = createStore(
  persistReducer(
    {
      key: 'root',
      storage: AsyncStorage,

      // Transform dates back into JS Dates on rehydrate
      // (see: https://github.com/rt2zz/redux-persist/issues/82)
      transforms: [
        // @ts-ignore
        createTransform(JSON.stringify, toRehydrate =>
          JSON.parse(toRehydrate, (_key, value) =>
            typeof value === 'string' &&
            value.match(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/)
              ? new Date(value)
              : value,
          ),
        ),
      ],

      whitelist: [
        'history',
        'customDuration',
        'hasChanting',
        'hasExtendedMetta',
        'isEnoughTime',
        'amNotification',
        'amNotificationTime',
        'pmNotification',
        'pmNotificationTime',
        'historyViewIndex',
        'isOldStudent',
        'displayName',
        'notifications_allowed',
        'airplaneModeReminder',
        'mainScreenSwitcherIndex',
      ],
    },
    reducer,
  ),
);

const Persistence = () => (
  <SafeAreaProvider>
    <Provider store={store}>
      <PersistGate persistor={persistStore(store)}>
        <App />
      </PersistGate>
    </Provider>
  </SafeAreaProvider>
);

export default Persistence;
