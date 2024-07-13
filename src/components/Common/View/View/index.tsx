import { StyleProp, View as RNView, ViewProps as RNViewProps, ViewStyle } from 'react-native';
import React from 'react';
import withTailwind from '@components/hoc/withTailwind';

export interface ViewProps extends RNViewProps {
  className?: string;
}

const View: React.FC<ViewProps> = React.forwardRef((props, ref: any) => {
  const { style: styleProp, ...otherProps } = props;
  const style: StyleProp<ViewStyle> = [styleProp];
  return (
    <RNView testID="View" ref={ref} {...otherProps} style={style}>
      {props.children}
    </RNView>
  );
});

export interface ViewType extends RNView {}

export default withTailwind(View) as React.FC<ViewProps & { ref?: React.LegacyRef<RNView> }>;
