import { StyleProp, View as RNView, ViewStyle } from 'react-native';
import React from 'react';
import withTailwind from '@components/hoc/withTailwind';
import {
  SafeAreaView as RNSafeAreaView,
  SafeAreaViewProps as RNSafeAreaViewProps,
} from 'react-native-safe-area-context';

export interface SafeAreaViewProps extends RNSafeAreaViewProps {
  className?: string;
}

const SafeAreaView: React.FC<SafeAreaViewProps> = React.forwardRef((props, ref: any) => {
  const { style: styleProp, ...otherProps } = props;
  const style: StyleProp<ViewStyle> = [styleProp];
  return (
    <RNSafeAreaView testID="SafeAreaView" ref={ref} {...otherProps} style={style}>
      {props.children}
    </RNSafeAreaView>
  );
});

export interface SafeAreaViewType extends RNView {}

export default withTailwind(SafeAreaView) as React.FC<
  SafeAreaViewProps & { ref?: React.LegacyRef<RNView> }
>;
