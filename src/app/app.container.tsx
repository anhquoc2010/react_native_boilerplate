import Notification from '@plugins/Notification';
import { changeLanguageConfig } from '@store/app';
import AppHelper from '@utils/AppHelper';
import { useAppDispatch, useAppSelector } from '@utils/Redux';
import React, { useLayoutEffect, useState } from 'react';
import FlashMessage from 'react-native-flash-message';
import SplashScreen from 'react-native-splash-screen';
import AppNavigator from './app.navigator';
import { LoadingScreen } from './index';
import Sentry from '@plugins/Sentry';
import { useColorScheme } from 'nativewind';
import Helper from '@utils/Helper';

export default function AppContainer() {
  const [language, colorSchemeState, loginData] = useAppSelector(state => [
    state.app.language,
    state.app.colorScheme,
    state.auth.data,
  ]);
  const dispatch = useAppDispatch();
  const { colorScheme, toggleColorScheme } = useColorScheme();

  const [hasInitialized, setHasInitialized] = useState(false);

  const handleNotification = async () => {
    const hasPermission = await Notification.requestUserPermission();

    if (hasPermission) {
      await Notification.triggerMessageListener();
    }
    return Notification.messageSubscribe;
  };

  useLayoutEffect(() => {
    global.app = {
      dispatch,
      deviceInfo: {} as any,
      token: '',
      fn: {} as any,
      theme: {
        colorScheme: 'light',
        toggleColorScheme: () => {},
      },
    };

    const initApp = async () => {
      if (loginData?.token) {
        global.app.token = loginData.token;
      }

      Sentry.setUser(loginData);

      await changeLanguageConfig(language);

      global.app.fn = {} as any;
      global.app.dispatch = dispatch;
      if (colorScheme !== colorSchemeState) {
        toggleColorScheme();
      }
      global.app.theme = { colorScheme: colorSchemeState, toggleColorScheme };

      await AppHelper.setGlobalDeviceInfo();

      setHasInitialized(true);

      await Helper.sleep(100);
      SplashScreen.hide();

      await handleNotification();
    };
    initApp();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {hasInitialized ? <AppNavigator /> : <LoadingScreen />}
      <FlashMessage position="top" />
    </>
  );
}
