import React from 'react';
import { StatusBar, View } from 'react-native';

export default function DefaultModal() {
  return (
    <>
      <StatusBar barStyle="light-content" />
      <View testID="ModalView" />
    </>
  );
}
