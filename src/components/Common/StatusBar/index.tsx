import React from 'react';
import { StatusBar as RNStatusBar, StatusBarProps } from 'react-native';
import { useIsFocused } from '@react-navigation/native';

function StatusBar(props: StatusBarProps) {
  const isFocused = useIsFocused();

  return isFocused ? <RNStatusBar animated {...props} /> : null;
}

export default StatusBar;
