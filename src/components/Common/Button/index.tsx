import React, { useMemo } from 'react';
import {
  StyleProp,
  Button as RNButton,
  ButtonProps as RNButtonProps,
  ViewStyle,
  TextStyle,
  ColorValue,
  ActivityIndicator,
  Text,
  TextProps,
  StyleSheet,
} from 'react-native';
import withTailwind from '@components/hoc/withTailwind';
import { useTheme } from '@react-navigation/native';
import AppView from '@utils/AppView';
import { ViewProps } from '../View/View';
import Icon, { IconProps } from '../Icon';
import Touchable, { TouchableProps } from './Touchable';
import Color from 'color';
import CONSTANT from '@configs/constant';
import TouchableOpacity from './TouchableOpacity';

export interface ButtonProps
  extends Omit<RNButtonProps, 'color' | 'title'>,
    ViewProps,
    TouchableProps {
  title?: string;
  leftIconProps?: IconProps;
  rightIconProps?: IconProps;
  textStyle?: StyleProp<TextStyle>;
  textProps?: TextProps;
  backgroundColor?: ColorValue;
  loading?: boolean;
  outline?: boolean;
  clear?: boolean;
  style?: StyleProp<ViewStyle & { color?: ColorValue | undefined }>;
  touchComponent?: 'TouchableOpacity' | 'Touchable';
}

const Button: React.FC<ButtonProps> = React.forwardRef((props, ref: any) => {
  const theme = useTheme();
  const {
    style: rawStyleProp,
    disabled: disabledProp,
    accessibilityState: accessibilityStateProp,
    title,
    leftIconProps,
    rightIconProps,
    textStyle: rawTextStyleProp,
    textProps,
    backgroundColor: backgroundColorProp,
    loading,
    outline,
    clear,
    touchComponent,
    ...otherProps
  } = props;
  const styleProp = StyleSheet.flatten(rawStyleProp);
  const textStyleProp = StyleSheet.flatten(rawTextStyleProp);

  // @ts-ignore
  const fontFamily = styleProp?.fontFamily || AppView.fontFamily;
  const backgroundColor = backgroundColorProp || theme.colors.primary;
  const borderColor =
    styleProp?.borderColor ||
    styleProp?.borderTopColor ||
    styleProp?.borderBottomColor ||
    styleProp?.borderLeftColor ||
    styleProp?.borderRightColor;
  const textColor =
    styleProp?.color ||
    textStyleProp?.color ||
    (outline || clear ? backgroundColor || borderColor || 'white' : 'white');

  const { quickStyles, quickTextStyles } = AppView.getQuickStyle({
    outline,
    clear,
    backgroundColor,
    textColor,
    borderColor,
  });

  const buttonStyles: StyleProp<ViewStyle> = [
    {
      elevation: 4,
      borderRadius: AppView.roundedBorderRadius,
      flexDirection: 'row',
      justifyContent: 'center',
    },
    quickStyles,
    styleProp,
  ];

  const defaultTextStyles: StyleProp<TextStyle> = {
    textAlign: 'center',
    fontFamily,
    margin: CONSTANT.BUTTON.MARGIN,
    fontSize: CONSTANT.BUTTON.FONT_SIZE,
    color: textColor,
    fontWeight: CONSTANT.BUTTON.FONT_WEIGHT as TextStyle['fontWeight'],
    alignSelf: 'center',
    opacity: loading ? 0 : 1,
    textTransform: (styleProp as any)?.textTransform,
  };
  const textStyles: StyleProp<TextStyle> = [defaultTextStyles, quickTextStyles, textStyleProp];

  const {
    color: iconColor,
    fontSize: iconSize,
    ...otherTextStyle
  } = StyleSheet.flatten(textStyles);

  // const iconPaddingHorizontal =
  //   otherTextStyle.paddingLeft || otherTextStyle.paddingRight || otherTextStyle.paddingHorizontal;

  const leftIconStyles: StyleProp<TextStyle> = [
    otherTextStyle,
    {
      margin: 0,
      marginRight: title
        ? CONSTANT.BUTTON.ICON_TITLE_MARGIN_HORIZONTAL -
          ((otherTextStyle.marginHorizontal || otherTextStyle.margin || 0) as number)
        : 0,
      marginLeft: title ? otherTextStyle.marginHorizontal || otherTextStyle.margin : 0,
    },
    leftIconProps?.style,
  ];

  const rightIconStyles: StyleProp<TextStyle> = [
    otherTextStyle,
    {
      margin: 0,
      marginLeft: title ? -((otherTextStyle.margin as number) / 2) : 0,
      marginRight: title ? otherTextStyle.margin : 0,
    },
    rightIconProps?.style,
  ];

  const disabled = disabledProp != null ? disabledProp : accessibilityStateProp?.disabled;
  const accessibilityState =
    disabled !== accessibilityStateProp?.disabled
      ? { ...accessibilityStateProp, disabled }
      : accessibilityStateProp;

  /* istanbul ignore else */
  if (disabled) {
    buttonStyles.push({
      elevation: 0,
      backgroundColor: theme.colors.grey5,
    });
    textStyles.push({ color: Color(theme.colors.grey3).lighten(0.2).hex() });
  }

  const TouchComponent = useMemo(
    () => (touchComponent === 'TouchableOpacity' ? TouchableOpacity : Touchable),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  return (
    <TouchComponent
      ref={ref}
      {...otherProps}
      accessibilityState={accessibilityState}
      disabled={disabled || loading}
      style={buttonStyles}
    >
      {leftIconProps ? (
        <Icon
          testID="LeftIcon"
          color={iconColor}
          size={iconSize}
          {...leftIconProps}
          style={leftIconStyles}
        />
      ) : null}
      {title ? (
        <Text testID="ButtonTitleText" {...textProps} style={textStyles}>
          {title}
        </Text>
      ) : null}
      {rightIconProps ? (
        <Icon
          testID="RightIcon"
          color={iconColor}
          size={iconSize}
          {...rightIconProps}
          style={rightIconStyles}
        />
      ) : null}
      {loading ? (
        <ActivityIndicator
          testID="Loading"
          style={{
            position: 'absolute',
            alignSelf: 'center',
            justifyContent: 'center',
            height: '100%',
          }}
          color={disabled ? theme.colors.grey3 : textColor}
        />
      ) : null}
    </TouchComponent>
  );
});

Button.defaultProps = {};

export interface ButtonType extends RNButton {}

export default withTailwind(Button) as React.FC<ButtonProps & { ref?: React.LegacyRef<RNButton> }>;
