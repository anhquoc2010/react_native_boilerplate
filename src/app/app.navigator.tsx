import React, { useEffect, useMemo } from 'react';
import { Platform, StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ModalStack from '@routes/Modal/index.stack';
import { useAppSelector } from '@utils/Redux';
import DarkColor from '@themes/DarkColor';
import DefaultColor from '@themes/DefaultColor';
import { ActionSheetProvider } from '@expo/react-native-action-sheet';
import ModalProvider from '@components/Common/Modal/ModalProvider';
import BottomSheetProvider from '@components/Common/BottomSheet/BottomSheetProvider';
import Navigation from '@utils/Navigation';
import MainStack from '@routes';
import Sentry from '@plugins/Sentry';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  const colorScheme = useAppSelector(state => state.app.colorScheme);
  const theme: any = useMemo(
    () => (colorScheme === 'dark' ? DarkColor : DefaultColor),
    [colorScheme],
  );

  useEffect(() => {
    /* istanbul ignore else */
    if (Platform.OS === 'android') {
      StatusBar.setBackgroundColor('transparent', true);
      StatusBar.setTranslucent(true);
    }
    Sentry.reactNavigationInstrumentation?.registerNavigationContainer?.(Navigation.navigationRef);
  }, []);

  return (
    <>
      <StatusBar barStyle={colorScheme === 'dark' ? 'light-content' : 'dark-content'} />
      <NavigationContainer ref={Navigation.navigationRef} theme={theme}>
        <ActionSheetProvider>
          <ModalProvider>
            <BottomSheetProvider>
              <Stack.Navigator screenOptions={{ headerShown: false }}>
                <Stack.Screen name="MainStack" component={MainStack} />
                {ModalStack()}
              </Stack.Navigator>
            </BottomSheetProvider>
          </ModalProvider>
        </ActionSheetProvider>
      </NavigationContainer>
    </>
  );
}
