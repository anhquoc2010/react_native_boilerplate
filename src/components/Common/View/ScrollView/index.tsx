import {
  ScrollView as RNScrollView,
  ScrollViewProps as RNScrollViewProps,
  StyleProp,
  ViewStyle,
} from 'react-native';
import React from 'react';
import withTailwind from '@components/hoc/withTailwind';

export interface ScrollViewProps extends RNScrollViewProps {
  className?: string;
}

const ScrollView: React.FC<ScrollViewProps> = React.forwardRef((props, ref: any) => {
  const { style: styleProp, ...otherProps } = props;
  const style: StyleProp<ViewStyle> = [styleProp];
  return (
    <RNScrollView testID="ScrollView" ref={ref} {...otherProps} style={style}>
      {props.children}
    </RNScrollView>
  );
});

export interface ScrollViewType extends RNScrollView {}

export default withTailwind(ScrollView) as React.FC<
  ScrollViewProps & { ref?: React.LegacyRef<RNScrollView> }
>;
