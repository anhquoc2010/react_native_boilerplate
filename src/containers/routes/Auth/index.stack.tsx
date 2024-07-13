import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AuthScreens from '@screens/Auth';
import AppHelper from '@utils/AppHelper';

const Stack = createNativeStackNavigator();

export default function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {AppHelper.createScreenList(AuthScreens)}
    </Stack.Navigator>
  );
}
