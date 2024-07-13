import { StyleProp, View as RNView, ViewStyle } from 'react-native';
import React from 'react';
import withTailwind from '@components/hoc/withTailwind';
import { ViewProps } from '../View/View';
import { useTheme } from '@react-navigation/native';

export interface DividerProps extends ViewProps {}

const Divider: React.FC<DividerProps> = React.forwardRef((props, ref: any) => {
  const theme = useTheme();
  const { style: styleProp, ...otherProps } = props;

  const defaultStyle: StyleProp<ViewStyle> = {
    height: 1,
    backgroundColor: theme.colors.border,
  };

  const style: StyleProp<ViewStyle> = [defaultStyle, styleProp];
  return <RNView ref={ref} {...otherProps} style={style} />;
});

export default withTailwind(Divider) as React.FC<ViewProps & { ref?: React.LegacyRef<RNView> }>;
