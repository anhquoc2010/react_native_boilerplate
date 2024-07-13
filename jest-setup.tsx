import React from 'react';

import 'react-native-gesture-handler/jestSetup';
import '@testing-library/jest-native/extend-expect';
require('react-native-reanimated/lib/reanimated2/jestUtils').setUpTests();

jest.mock('react-native-reanimated', () => require('react-native-reanimated/mock'));

jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock'),
);

jest.mock('react-native-device-info', () => ({
  ...jest.requireActual('react-native-device-info/jest/react-native-device-info-mock'),
  // getVersion: jest.fn().mockReturnValue('1.0.0'),
  // getBuildNumber: jest.fn().mockReturnValue(1),
}));

jest.mock('@sentry/react-native', () => ({
  init: jest.fn(),
  ReactNativeTracing: jest.fn(),
  ReactNavigationInstrumentation: jest.fn(),
  setUser: jest.fn(),
  flush: jest.fn(),
  wrap: jest.fn().mockImplementation(component => component),
  createReduxEnhancer: jest.fn().mockReturnValue(function (next: any) {
    return function (reducer: any, initialState: any) {
      return next(reducer, initialState);
    };
  }),
}));

jest.mock('react-native-encrypted-storage', () => ({
  setItem: jest.fn(() => Promise.resolve()),
  getItem: jest.fn(() => Promise.resolve('{ "foo": 1 }')),
  removeItem: jest.fn(() => Promise.resolve()),
  clear: jest.fn(() => Promise.resolve()),
}));

jest.mock('react-native-localize', () => require('react-native-localize/mock.js'));

jest.mock('react-native/Libraries/EventEmitter/NativeEventEmitter');

// jest.mock('@react-native-firebase/app', () => ({
//   messaging: jest.fn(() => ({
//     hasPermission: jest.fn(() => Promise.resolve(true)),
//     subscribeToTopic: jest.fn(),
//     unsubscribeFromTopic: jest.fn(),
//     requestPermission: jest.fn(() => Promise.resolve(true)),
//     getToken: jest.fn(() => Promise.resolve('myMockToken')),
//     onMessage: jest.fn(),
//   })),
//   analytics: jest.fn(() => ({
//     logEvent: jest.fn(),
//     setUserProperties: jest.fn(),
//     setUserId: jest.fn(),
//     setCurrentScreen: jest.fn(),
//   })),
// }));

jest.mock('redux-persist', () => ({
  ...jest.requireActual('redux-persist'),
  persistReducer: jest.fn().mockImplementation((config, reducers) => reducers),
  persistStore: jest.fn().mockImplementation(store => store),
}));

jest.mock('redux-persist/integration/react', () => ({
  PersistGate: (props: any) => props.children,
}));

jest.mock('@react-native-community/hooks', () => ({
  ...jest.requireActual('@react-native-community/hooks'),
  useAccessibilityInfo: jest.fn().mockReturnValue({ reduceMotion: false }),
}));

// Silence the warning: Animated: `useNativeDriver` is not supported because the native animated module is missing
jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper');

jest.mock('@gorhom/bottom-sheet', () => {
  const react = require('react-native');

  return {
    ...require('@gorhom/bottom-sheet/mock'),
    BottomSheetFlatList: react.FlatList,
    BottomSheetSectionList: react.SectionList,
  };
});

jest.mock('react-native-safe-area-context', () => ({
  ...jest.requireActual('react-native-safe-area-context'),
  useSafeAreaInsets: jest.fn().mockImplementation(() => ({
    left: 0,
    right: 0,
    bottom: 0,
    top: 0,
  })),
}));

jest.mock('@react-navigation/drawer', () => ({
  createDrawerNavigator: jest.fn().mockReturnValue({
    Navigator: ({ children }: any) => <>{children}</>,
    Screen: ({ children }: any) => <>{children}</>,
  }),
  DrawerContentScrollView: ({ children }: any) => <>{children}</>,
  DrawerItemList: ({ children }: any) => <>{children}</>,
}));

jest.mock('react-native-navigation-bar-color');

jest.mock('@react-native-community/netinfo', () =>
  require('@react-native-community/netinfo/jest/netinfo-mock.js'),
);

global.app.fetch = jest.fn();
