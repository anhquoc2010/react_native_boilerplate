import React, { useEffect } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MainBottomTab from '@routes/Main/index.bottomtab';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Dimensions, Platform } from 'react-native';
import AppView from '@utils/AppView';
import { useAppSelector } from '@utils/Redux';
import AuthStack from './Auth/index.stack';
import { useTheme } from '@react-navigation/native';
import { Icon, TouchableOpacity } from '@components';
import Navigation from '@utils/Navigation';
import SettingsStack from './Main/Settings/index.stack';
import FlatListStack from './Main/Home/Example/FlatList/index.stack';

const Stack = createNativeStackNavigator();

export const SwitchScreens = {
  AuthStack,
  MainBottomTab,
};

function SwitchStack() {
  const [loginData] = useAppSelector(state => [state.auth.data]);

  /* istanbul ignore else */
  if (!loginData?.token) {
    return <Stack.Screen name="AuthStack" component={AuthStack} options={{ headerShown: false }} />;
  }
  return (
    <Stack.Screen name="MainBottomTab" component={MainBottomTab} options={{ headerShown: false }} />
  );
}

export default function MainStack() {
  const theme = useTheme();
  /**
   * Handle Screen Metrics & SafeAreaInsets
   */

  useEffect(() => {
    Dimensions.addEventListener('change', newDimensions =>
      AppView.onDimensionChange(newDimensions),
    );
  });
  const insets = useSafeAreaInsets();
  AppView.initSafeArea(insets);

  return (
    <Stack.Navigator
      screenOptions={{
        ...AppView.getHeaderStyle(theme),
        headerLeft:
          Platform.OS === 'ios'
            ? () => (
                <TouchableOpacity
                  onPress={
                    /* istanbul ignore next */
                    () => Navigation.goBack()
                  }
                >
                  <Icon
                    type="antdesign"
                    name="left"
                    size={22}
                    style={{ padding: 5, marginLeft: -10 }}
                  />
                </TouchableOpacity>
              )
            : undefined,
      }}
    >
      {SwitchStack()}
      {FlatListStack()}
      {SettingsStack()}
    </Stack.Navigator>
  );
}
