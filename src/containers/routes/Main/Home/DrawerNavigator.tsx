import React from 'react';
import {
  DrawerContentScrollView,
  DrawerItemList,
  DrawerContentComponentProps,
} from '@react-navigation/drawer';
import { switchTheme } from '@store/app';
import ImageSource from '@images';
import { useAppDispatch, useAppSelector } from '@utils/Redux';
import { Switch, Text, View } from '@components';
import { useTheme } from '@react-navigation/native';
import { Image } from 'react-native';

function CustomContentComponent(props: DrawerContentComponentProps) {
  const theme = useTheme();
  const colorScheme = useAppSelector(state => state.app.colorScheme);
  const dispatch = useAppDispatch();

  return (
    <View>
      <View className="justify-center items-center">
        <Image
          source={ImageSource.logo}
          style={{ width: '70%', height: 100, tintColor: theme.colors.primary }}
          resizeMode="contain"
        />
      </View>

      <View className="flex-row w-full pl-[25px] pb-[5px]">
        <Text className="mt-[3px]">Dark Mode</Text>
        <Switch
          testID="ThemeSwitch"
          className="absolute right-5"
          value={colorScheme === 'dark'}
          onValueChange={() => {
            dispatch(switchTheme());
          }}
        />
      </View>
      {/* <Divider style={{ marginTop: 15 }} /> */}
      <View>
        <DrawerItemList {...props} />
      </View>
    </View>
  );
}

function CustomDrawerContent(props: DrawerContentComponentProps) {
  return (
    <DrawerContentScrollView {...props}>
      <CustomContentComponent {...props} />
    </DrawerContentScrollView>
  );
}

export default CustomDrawerContent;
