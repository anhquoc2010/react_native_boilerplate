import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import Icon from 'react-native-vector-icons/Ionicons';
import AppView from '@utils/AppView';
import DrawerNavigator from './DrawerNavigator';
import { useTheme } from '@react-navigation/native';
import _ from 'lodash';
import DrawerScreens from '@screens/Main/Home';

const list = _.sortBy(
  (Object.keys(DrawerScreens) as any).map((key: keyof typeof DrawerScreens) => ({
    name: key,
    label: DrawerScreens[key].label,
    component: DrawerScreens[key].component,
    iconName: DrawerScreens[key].iconName,
  })),
  ['label'],
);

const Drawer = createDrawerNavigator();

function MainDrawer() {
  const theme = useTheme();

  return (
    <Drawer.Navigator
      // initialRouteName="FlatListExample"
      drawerContent={DrawerNavigator}
      screenOptions={{
        drawerActiveTintColor: theme.colors.primary,
        drawerActiveBackgroundColor: 'transparent',
        drawerInactiveTintColor: theme.colors.card,
        drawerInactiveBackgroundColor: 'transparent',
        drawerLabelStyle: {
          fontSize: 15,
          marginLeft: 0,
          paddingLeft: 1,
          fontWeight: 'normal',
          fontFamily: AppView.fontFamily,
        },
        drawerStyle: {
          backgroundColor: theme.colors.card,
        },
        headerTintColor: theme.colors.grey0,
        drawerType: 'front',
        // drawerType: AppView.screenWidth >= 768 ? 'permanent' : 'front',
        ...AppView.getHeaderStyle(theme),
      }}
    >
      {list.map(e => (
        <Drawer.Screen
          key={e.name}
          name={e.name}
          component={e.component}
          options={{
            drawerIcon:
              /* istanbul ignore next */
              ({ color, size, focused }: any) => (
                <Icon
                  name={focused ? e.iconName : (`${e.iconName}-outline` as any)}
                  color={color}
                  size={size}
                  style={{ marginRight: -20 }}
                />
              ),
            title: e.label,
            drawerActiveTintColor: theme.colors.primary,
            drawerInactiveTintColor: theme.colors.grey0,
          }}
        />
      ))}
    </Drawer.Navigator>
  );
}

export default MainDrawer;
