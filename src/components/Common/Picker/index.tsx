import React, { useMemo, useState, useRef, useImperativeHandle, useEffect } from 'react';
import { ColorValue, Platform, View, TouchableOpacity, StyleProp, TextStyle } from 'react-native';
import withTailwind from '@components/hoc/withTailwind';
import { useTranslation } from 'react-i18next';
import { AdditionalTextInputProps, handleInputStyle, ReactHookFormProps } from '../Input';
import { useTheme } from '@react-navigation/native';
import Text from '../Text';
import Icon from '../Icon';
import { ActionSheetOptions, useActionSheet } from '@expo/react-native-action-sheet';
import { useForm, useController } from 'react-hook-form';
import Helper from '@utils/Helper';
import ModalPicker, { ModalPickerProps } from './ModalPicker';
import { ModalType } from '../Modal';
import _ from 'lodash';

export interface BasePickerProps
  extends ActionSheetOptions,
    AdditionalTextInputProps,
    ReactHookFormProps {
  className?: string;
  editable?: boolean;
  placeholder?: string;
  placeholderTextColor?: ColorValue;
  onCancel?: () => void;
  style?: StyleProp<TextStyle> | undefined;
  useModal?: boolean;
  modalPickerProps?: ModalPickerProps;
}

interface SingleSelect {
  type: 'single';
  selectedIndex?: number;
  onConfirm?: (buttonIndex: number) => void;
  convertValueToText?: (buttonIndex: number) => string;
}

interface MultipleSelect {
  type: 'multiple';
  selectedIndexes?: number[];
  onConfirm?: (buttonIndexes: number[]) => void;
  convertValueToText?: (buttonIndexes: number[]) => string;
}

export type PickerProps = BasePickerProps & (SingleSelect | MultipleSelect);

const Picker: React.FC<PickerProps> = React.forwardRef((props, ref: any) => {
  let pickerRef = useRef<View>(null);
  const modalPickerRef = useRef<ModalType>(null);

  const theme = useTheme();
  const { t } = useTranslation();
  const { showActionSheetWithOptions } = useActionSheet();

  const {
    title,
    titleProps,
    errorProps,
    leftIconProps,
    rightIconProps,
    name,
    type,
    // @ts-ignore
    selectedIndex: selectedIndexProp,
    // @ts-ignore
    selectedIndexes: selectedIndexesProp,
    convertValueToText: convertValueToTextProp,
    editable,
    onConfirm,
    onCancel,
    placeholder,
    options: optionsProp,
    control,
    nextField,
    rules,
    useModal,
    modalPickerProps,
    ...otherProps
  } = props;

  const handledStyle = useMemo(() => handleInputStyle(props, theme), [props, theme]);
  const { placeholderTextColor, inactiveBorderColor, activeBorderColor } = handledStyle;

  const [selectedIndex, setSelectedIndex] = useState<number>(selectedIndexProp);
  const [selectedIndexes, setSelectedIndexes] = useState<number[]>(selectedIndexesProp || []);

  const [borderColor, setBorderColor] = useState(
    !props.autoFocus ? inactiveBorderColor : activeBorderColor,
  );
  useEffect(() => {
    setBorderColor(inactiveBorderColor);
  }, [inactiveBorderColor]);

  const { control: formControl } = useForm({ mode: 'onTouched' });
  const { field, fieldState, formState } = useController({
    control: control || formControl,
    defaultValue: selectedIndexProp,
    rules,
    name: name || '',
  });

  const onOpenActionSheet = async () => {
    if (useModal || type === 'multiple') {
      modalPickerRef.current?.trigger(true);
      return;
    }

    if (!fieldState.error) {
      setBorderColor(activeBorderColor);
      await Helper.sleep(100);
    }
    showActionSheetWithOptions(
      {
        options: [...optionsProp, t('common.cancel')],
        destructiveButtonIndex: Platform.OS === 'android' ? optionsProp.length : undefined,
        cancelButtonIndex: optionsProp.length,
        userInterfaceStyle: theme.dark ? 'dark' : 'light',
        containerStyle: { backgroundColor: theme.colors.card },
        textStyle: { color: theme.colors.text },
        title,
      },
      async buttonIndex => {
        if (buttonIndex !== undefined && buttonIndex !== optionsProp.length) {
          if (name && control) {
            field.onChange(buttonIndex);
            field.onBlur();

            setSelectedIndex(buttonIndex);
            onConfirm?.(buttonIndex as any);

            const isValidated = await nextField?.trigger(name);

            if (isValidated) {
              setBorderColor(inactiveBorderColor);
              if (nextField && !formState.touchedFields[nextField.name]) {
                setTimeout(
                  () => {
                    nextField?.setFocus(nextField.name);
                  },
                  Platform.OS === 'android' ? 0 : 300,
                );
              }
            }
          } else {
            setSelectedIndex(buttonIndex);
            onConfirm?.(buttonIndex as any);
          }
        } else {
          const isValidated = await nextField?.trigger(name);
          if (isValidated) {
            setBorderColor(inactiveBorderColor);
          }
          if (name && control) {
            field.onBlur();
          }
          onCancel?.();
        }
      },
    );
  };

  const convertValueToText = () => {
    let text = placeholder;

    if (selectedIndex !== undefined) {
      if (convertValueToTextProp) {
        text = convertValueToTextProp(selectedIndex as any);
      } else {
        text = optionsProp[selectedIndex];
      }
    } else if (!_.isEmpty(selectedIndexes)) {
      if (convertValueToTextProp) {
        text = convertValueToTextProp(selectedIndexes as any);
      } else {
        text = optionsProp.filter((__, index) => selectedIndexes.includes(index)).join(', ');
      }
    }
    return text;
  };

  useImperativeHandle(ref, () => ({
    ...pickerRef.current,
    selectedIndex,
    setSelectedIndex,
    focus: onOpenActionSheet,
  }));

  useEffect(() => {
    if (name && control && fieldState.error && borderColor !== theme.colors.error) {
      setBorderColor(theme.colors.error);
    }
  }, [borderColor, control, fieldState.error, name, theme.colors]);

  const renderErrors = () => {
    if (name && control && fieldState.error) {
      return (
        <Text
          testID="ErrorText"
          color={theme.colors.error}
          {...errorProps}
          style={handledStyle.errorStyles}
        >
          {fieldState.error.message}
        </Text>
      );
    }
    return null;
  };

  const handleRef = (e: any) => {
    if (e) {
      e.focus = onOpenActionSheet;
    }
    field.ref(e);
    pickerRef = {
      current: e,
    };
  };

  return (
    <View testID="ContainerView" ref={handleRef} style={handledStyle.containerStyle}>
      {title ? (
        <Text testID="TitleText" {...titleProps} style={handledStyle.titleStyles}>
          {title}
        </Text>
      ) : null}

      <TouchableOpacity
        testID="PickerButton"
        activeOpacity={0.6}
        style={[handledStyle.inputContainerStyle, { borderColor }]}
        onPress={onOpenActionSheet}
        disabled={!editable}
      >
        {leftIconProps ? (
          <Icon
            testID="LeftIcon"
            color={handledStyle.otherStyle.color}
            size={handledStyle.otherStyle.fontSize}
            {...leftIconProps}
            style={[handledStyle.leftIconStyles, leftIconProps.style]}
          />
        ) : null}
        <Text
          testID="OptionText"
          {...(otherProps as any)}
          style={[
            handledStyle.otherStyle,
            {
              color:
                selectedIndex !== undefined || !_.isEmpty(selectedIndexes)
                  ? handledStyle.otherStyle.color
                  : placeholderTextColor,
            },
          ]}
        >
          {convertValueToText()}
        </Text>
        {rightIconProps ? (
          <Icon
            testID="RightIcon"
            color={handledStyle.otherStyle.color}
            size={handledStyle.otherStyle.fontSize}
            {...rightIconProps}
            style={[handledStyle.rightIconStyles, rightIconProps.style]}
          />
        ) : null}
      </TouchableOpacity>
      {renderErrors()}
      <ModalPicker
        ref={modalPickerRef}
        {...modalPickerProps}
        options={optionsProp}
        selectedIndex={selectedIndex}
        setSelectedIndex={setSelectedIndex}
        selectedIndexes={selectedIndexes}
        setSelectedIndexes={setSelectedIndexes}
        onCancel={onCancel}
        onConfirm={onConfirm as any}
        type={type as any}
      />
    </View>
  );
});

Picker.defaultProps = {
  editable: true,
  placeholder: '',
  type: 'single',
};

export interface PickerType extends BasePickerProps {
  selectedIndex: number;
  setSelectedIndex: (selectedIndex: number) => void;
  focus: () => void;
  focusIfEmpty: () => void;
}

export default withTailwind(Picker) as React.FC<
  PickerProps & { ref?: React.LegacyRef<PickerProps> }
>;
