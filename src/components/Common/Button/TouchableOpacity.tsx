import React from 'react';
import {
  StyleProp,
  TouchableOpacity as RNTouchableOpacity,
  TouchableOpacityProps as RNTouchableOpacityProps,
  ViewStyle,
} from 'react-native';
import withTailwind from '@components/hoc/withTailwind';

export interface TouchableOpacityProps extends RNTouchableOpacityProps {
  className?: string;
}

const TouchableOpacity: React.FC<TouchableOpacityProps> = React.forwardRef((props, ref: any) => {
  const { style: styleProp, ...otherProps } = props;
  const style: StyleProp<ViewStyle> = [styleProp];
  return (
    <RNTouchableOpacity testID="TouchableOpacity" ref={ref} {...otherProps} style={style}>
      {props.children}
    </RNTouchableOpacity>
  );
});

export interface TouchableOpacityType extends RNTouchableOpacity {}

export default withTailwind(TouchableOpacity) as React.FC<
  TouchableOpacityProps & { ref?: React.LegacyRef<RNTouchableOpacity> }
>;
