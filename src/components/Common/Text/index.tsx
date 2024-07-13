import { StyleProp, Text as RNText, TextProps as RNTextProps, TextStyle } from 'react-native';
import React from 'react';
import withTailwind from '@components/hoc/withTailwind';
import { useTheme } from '@react-navigation/native';
import AppView from '@utils/AppView';

export interface TextProps extends RNTextProps {
  className?: string;
  color?: string;
  primary?: boolean;
}
const Text: React.FC<TextProps> = React.forwardRef((props, ref: any) => {
  const theme = useTheme();
  const { style: styleProp, color, ...otherProps } = props;

  const style: StyleProp<TextStyle> = [
    {
      color: props.primary ? theme.colors.primary : color || theme.colors.text,
      fontFamily: AppView.fontFamily,
    },
    styleProp,
  ];

  return (
    <RNText testID="Text" ref={ref} {...otherProps} style={style}>
      {props.children}
    </RNText>
  );
});

export interface TextType extends RNText {}

export default withTailwind(Text) as React.FC<TextProps & { ref?: React.LegacyRef<RNText> }>;
