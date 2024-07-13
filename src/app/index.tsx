import store, { persistor } from '@core/configs/store';
import ImageSource from '@images';
import React from 'react';
import { ActivityIndicator, ImageBackground } from 'react-native';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import AppContainer from './app.container';
import Sentry from '@plugins/Sentry';

export const LoadingScreen = () => (
  <ImageBackground
    testID="LoadingImageBackground"
    style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
    resizeMode="cover"
    source={ImageSource.splash}
  >
    <ActivityIndicator size="large" color="white" style={{ marginTop: 250 }} />
  </ImageBackground>
);

function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={LoadingScreen()} persistor={persistor}>
        <AppContainer />
      </PersistGate>
    </Provider>
  );
}

export default Sentry.wrap(App);
