import React, { useEffect, useState } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import AppView from '@utils/AppView';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import MainDrawer from './Home/index.drawer';
import { useIsFocused, useTheme } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import changeNavigationBarColor from 'react-native-navigation-bar-color';
import { Platform } from 'react-native';
import SettingsTab from '@screens/Main/Settings/Tab';

const BottomTabs = createBottomTabNavigator();

export const BottomTabScreens = {
  HomeTab: MainDrawer,
  SettingsTab,
};

export default function MainBottomTab() {
  const insets = useSafeAreaInsets();
  /* istanbul ignore else */
  if (!insets.bottom) {
    insets.bottom = 5;
  }
  const { t } = useTranslation();

  const theme = useTheme();

  const isFocused = useIsFocused();

  const [isTabBarHidden, setIsTabBarHidden] = useState(false);

  useEffect(() => {
    /* istanbul ignore else */
    if (global.app.fn) {
      global.app.fn.setIsTabBarHidden = (isHidden: boolean) => {
        /* istanbul ignore else */
        if (isTabBarHidden !== isHidden) {
          setIsTabBarHidden(isHidden);
        }
      };
    }
  }, [isTabBarHidden, setIsTabBarHidden]);

  useEffect(() => {
    /* istanbul ignore else */
    if (Platform.OS === 'android') {
      if (isFocused) {
        changeNavigationBarColor(theme.colors.card, !theme.dark, false);
      } else {
        changeNavigationBarColor(theme.colors.background, !theme.dark, false);
      }
    }
  }, [isFocused, theme]);

  /**
   * Handle Screen Metrics & SafeAreaInsets
   */

  return (
    <BottomTabs.Navigator
      screenOptions={{
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.grey2,
        tabBarStyle: {
          // backgroundColor: theme.colors.card,
          // height: AppView.bottomNavigationBarHeight + insets.bottom,
          // paddingBottom: insets.bottom > 5 ? insets.bottom - 5 : insets.bottom,
          display: isTabBarHidden ? 'none' : 'flex',
        },
        tabBarItemStyle: {
          borderRadius: 20,
          marginTop: 3,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontFamily: AppView.fontFamily,
        },
        ...AppView.getHeaderStyle(theme),
      }}
    >
      <BottomTabs.Screen
        name="HomeTab"
        component={BottomTabScreens.HomeTab}
        options={{
          title: t('bottomTab.home'),
          headerShown: false,
          tabBarIcon: ({ color }) => <Icon name="home" color={color} size={24} />,
        }}
      />
      <BottomTabs.Screen
        name="SettingsTab"
        component={BottomTabScreens.SettingsTab}
        options={{
          title: t('bottomTab.settings'),
          tabBarIcon: ({ color }) => <Icon name="menu" color={color} size={24} />,
        }}
      />
    </BottomTabs.Navigator>
  );
}
