import React from 'react';
import {
  StyleProp,
  TouchableWithoutFeedback as RNTouchableWithoutFeedback,
  TouchableWithoutFeedbackProps as RNTouchableWithoutFeedbackProps,
  ViewStyle,
} from 'react-native';
import withTailwind from '@components/hoc/withTailwind';

export interface TouchableWithoutFeedbackProps extends RNTouchableWithoutFeedbackProps {
  className?: string;
  children?: any;
}

const TouchableWithoutFeedback: React.FC<TouchableWithoutFeedbackProps> = React.forwardRef(
  (props, ref: any) => {
    const { style: styleProp, ...otherProps } = props;
    const style: StyleProp<ViewStyle> = [styleProp];
    return (
      <RNTouchableWithoutFeedback
        testID="TouchableWithoutFeedback"
        ref={ref as any}
        {...otherProps}
        style={style}
      >
        {props.children}
      </RNTouchableWithoutFeedback>
    );
  },
);

export interface TouchableWithoutFeedbackType extends RNTouchableWithoutFeedback {}

export default withTailwind(TouchableWithoutFeedback) as React.FC<
  TouchableWithoutFeedbackProps & { ref?: React.LegacyRef<RNTouchableWithoutFeedback> }
>;
