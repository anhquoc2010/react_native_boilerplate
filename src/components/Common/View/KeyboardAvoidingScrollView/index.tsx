import {
  KeyboardAvoidingView,
  KeyboardAvoidingViewProps,
  Platform,
  ScrollView,
  StyleProp,
  ViewStyle,
  ScrollViewProps as RNScrollViewProps,
} from 'react-native';
import React from 'react';
import withTailwind from '@components/hoc/withTailwind';
import { ScrollViewType } from '../ScrollView';

export interface KeyboardAvoidingScrollViewProps
  extends RNScrollViewProps,
    KeyboardAvoidingViewProps {
  className?: string;
}

const KeyboardAvoidingScrollView: React.FC<KeyboardAvoidingScrollViewProps> = React.forwardRef(
  (props, ref: any) => {
    const {
      style: keyboardAvoidingScrollViewStyle,
      contentContainerStyle,
      keyboardVerticalOffset,
      enabled,
      behavior,
      ...otherProps
    } = props;
    const style: StyleProp<ViewStyle> = [{ flex: 1 }, keyboardAvoidingScrollViewStyle];

    return (
      <KeyboardAvoidingView
        testID="KeyboardAvoidingScrollView"
        behavior={behavior || Platform.OS === 'ios' ? 'padding' : 'height'}
        contentContainerStyle={contentContainerStyle}
        keyboardVerticalOffset={keyboardVerticalOffset}
        enabled={enabled}
        style={style}
      >
        <ScrollView ref={ref} {...otherProps}>
          {/* <TouchableWithoutFeedback onPress={Keyboard.dismiss}> */}
          {/* <RNView>{props.children}</RNView> */}
          {/* </TouchableWithoutFeedback> */}
          {props.children}
        </ScrollView>
      </KeyboardAvoidingView>
    );
  },
);

KeyboardAvoidingScrollView.defaultProps = {};
export default withTailwind(KeyboardAvoidingScrollView) as React.FC<
  KeyboardAvoidingScrollViewProps & { ref?: React.LegacyRef<ScrollViewType> }
>;
