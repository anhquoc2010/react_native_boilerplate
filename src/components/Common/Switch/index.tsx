import {
  StyleProp,
  StyleSheet,
  Switch as RNSwitch,
  SwitchProps as RNSwitchProps,
  ViewStyle,
} from 'react-native';
import React from 'react';
import withTailwind from '@components/hoc/withTailwind';
import { useTheme } from '@react-navigation/native';

export interface SwitchProps extends RNSwitchProps {
  className?: string;
}
const Switch: React.FC<SwitchProps> = React.forwardRef((props, ref: any) => {
  const theme = useTheme();
  const { style: styleProp, ...otherProps } = props;
  const style: StyleProp<ViewStyle> = StyleSheet.flatten(styleProp);
  return (
    <RNSwitch
      testID="Switch"
      ref={ref}
      trackColor={{
        true: theme.colors.primary,
        false: theme.colors.grey4,
      }}
      ios_backgroundColor={style?.backgroundColor || theme.colors.grey4}
      thumbColor="white"
      {...otherProps}
      style={style}
    >
      {props.children}
    </RNSwitch>
  );
});

export interface SwitchType extends RNSwitch {}

export default withTailwind(Switch) as React.FC<SwitchProps & { ref?: React.LegacyRef<RNSwitch> }>;
