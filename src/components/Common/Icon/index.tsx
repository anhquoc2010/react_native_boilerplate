import { StyleProp, TextStyle, TouchableOpacity, TouchableOpacityProps } from 'react-native';
import React from 'react';

import { useTheme } from '@react-navigation/native';
import { IconProps as VectorIconProps } from 'react-native-vector-icons/Icon';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import getIconType from './getIconType';
import IconSource from '@icons';
import { SvgProps } from 'react-native-svg';
import withTailwind from '@components/hoc/withTailwind';

interface ISvg {
  name: keyof typeof IconSource;
  type: 'svg';
}
export interface IIconProps extends VectorIconProps {
  className?: string;
  primary?: boolean;
}
export type IconProps = IIconProps &
  (
    | IDefault
    | ISvg
    | IMaterial
    | IMaterialCommunity
    | ISimpleLineIcon
    | IZocial
    | IOcticon
    | IFontAwesome
    | IFontAwesome5
    | IIonicon
    | IFoundation
    | IEvilicon
    | IEntypo
    | IAntdesign
    | IFeather
    | IFontisto
  ) &
  Omit<SvgProps, 'style' | 'color'> & { touchableProps?: TouchableOpacityProps };

const IconFC: React.FC<IconProps> = React.forwardRef((props, ref: any) => {
  const theme = useTheme();
  // @ts-ignore
  const { style: styleProp, type, onPress, touchableProps, ...otherProps } = props;
  const color = props.primary ? theme.colors.primary : theme.colors.text;
  const style: StyleProp<TextStyle> = [styleProp];
  let Component;
  if (type === 'svg') {
    Component = IconSource[props.name as keyof typeof IconSource];
  } else {
    Component = getIconType(type);
  }

  const IconComponent = (
    <Component testID="Icon" ref={ref} size={25} color={color} {...otherProps} style={style}>
      {props.children}
    </Component>
  );

  if (onPress) {
    return (
      <TouchableOpacity testID="IconTouchableOpacity" onPress={onPress} {...touchableProps}>
        {IconComponent}
      </TouchableOpacity>
    );
  }
  return IconComponent;
});

IconFC.defaultProps = {
  type: 'material-community',
};

export interface IconType extends MaterialIcon {}

const Icon = withTailwind(IconFC) as React.FC<IconProps & { ref?: React.LegacyRef<MaterialIcon> }>;

export default Icon;
