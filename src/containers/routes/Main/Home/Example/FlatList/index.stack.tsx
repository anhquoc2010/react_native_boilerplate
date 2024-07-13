import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import FlatListScreens from '@screens/Main/Home/Example/FlatList';

const Stack = createNativeStackNavigator();

export default function FlatListStack() {
  return (
    <>
      {(Object.keys(FlatListScreens) as any).map((key: keyof typeof FlatListScreens) => (
        <Stack.Screen key={key} name={key} component={FlatListScreens[key]} />
      ))}
    </>
  );
}
