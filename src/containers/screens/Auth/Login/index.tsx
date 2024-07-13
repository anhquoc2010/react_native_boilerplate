import React from 'react';
import LoginForm from './components/LoginForm';
import {
  Icon,
  KeyboardAvoidingScrollView,
  SafeAreaView,
  StatusBar,
  View,
  VersionText,
} from '@components';
import AppView from '@utils/AppView';
import { useTheme } from '@react-navigation/native';
import { Image, Keyboard, TouchableWithoutFeedback } from 'react-native';
import ImageSource from '@images';

export default function Login() {
  const theme = useTheme();
  return (
    <SafeAreaView testID="Login" className="flex-1" edges={['bottom']}>
      <StatusBar barStyle="light-content" />
      <View style={{ flex: 9.5 }}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View>
            <Icon
              type="svg"
              name="loginBackground"
              fill={theme.colors.primary}
              width={AppView.screenWidth}
              height={0.79 * AppView.screenWidth}
              className="absolute"
            />
            <View
              style={{
                width: AppView.screenWidth,
                height: 0.79 * AppView.screenWidth,
                justifyContent: 'center',
                paddingHorizontal: 24,
              }}
            >
              <View className="flex-row justify-center -mt-28">
                <Image
                  source={ImageSource.logo}
                  style={{ width: '50%', height: 100, tintColor: 'white' }}
                  resizeMode="contain"
                />
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
        <KeyboardAvoidingScrollView className="-mt-36 mx-8">
          <LoginForm />
        </KeyboardAvoidingScrollView>
      </View>
      <View style={{ flex: 0.5, justifyContent: 'center' }}>
        <VersionText />
      </View>
    </SafeAreaView>
  );
}
