import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { persistStore, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
import Sentry from '@plugins/Sentry';
import _ from 'lodash';
import storeItems from '@store';
import RNAsyncStorageFlipper from 'rn-async-storage-flipper';
import AsyncStorage from '@react-native-async-storage/async-storage';

function handleMiddleware(getDefaultMiddleware: any) {
  const middlewares = getDefaultMiddleware({
    serializableCheck: {
      ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
    },
  });

  // @ts-ignore
  if (__DEV__ && !process.env.JEST_WORKER_ID) {
    const reduxDebugger = require('redux-flipper').default;
    const asyncStorageDebugger = () => () => (next: any) => (action: any) => {
      RNAsyncStorageFlipper(AsyncStorage as any);
      return next(action);
    };
    middlewares.push(reduxDebugger());
    middlewares.push(asyncStorageDebugger());
  }
  return middlewares;
}

export const createStore = (preloadedState?: any) => {
  const sentryEnhancer = Sentry.createReduxEnhancer({
    stateTransformer: state => {
      if (state.auth) {
        const transformedState = {
          ...state,
          auth: {
            data: !_.isEmpty(state.auth.data)
              ? _.omit(state.auth.data, 'token', 'password')
              : state.auth.data,
          },
        };
        return transformedState;
      }
    },
  });
  return configureStore({
    reducer: combineReducers(storeItems),
    middleware: handleMiddleware,
    enhancers: getDefaultEnhancers => getDefaultEnhancers().concat(sentryEnhancer),
    preloadedState,
    devTools: true,
  });
};

const store = createStore();

export const persistor = persistStore(store);

export default store;
