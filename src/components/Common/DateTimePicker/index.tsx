import React, {
  useMemo,
  useState,
  useCallback,
  useImperativeHandle,
  useRef,
  useEffect,
} from 'react';
import { ColorValue, Platform, StyleProp, View, ViewStyle, TouchableOpacity } from 'react-native';
import withTailwind from '@components/hoc/withTailwind';
import DateTimePickerModal, {
  DateTimePickerProps as ModalDateTimePickerProps,
  NativePickerProps,
} from 'react-native-modal-datetime-picker';
import { useTranslation } from 'react-i18next';
import { AdditionalTextInputProps, handleInputStyle, ReactHookFormProps } from '../Input';
import { useTheme } from '@react-navigation/native';
import Text from '../Text';
import Icon from '../Icon';
import moment from 'moment';
import { IOSNativeProps } from '@react-native-community/datetimepicker';
import { useForm, useController } from 'react-hook-form';
import Helper from '@utils/Helper';

export interface DateTimePickerProps
  extends Partial<ModalDateTimePickerProps>,
    ReactHookFormProps,
    Omit<
      IOSNativeProps,
      | 'date'
      | 'locale'
      | 'maximumDate'
      | 'minimumDate'
      | 'minuteInterval'
      | 'mode'
      | 'onChange'
      | 'testID'
      | 'timeZoneOffsetInMinutes'
      | 'value'
    >,
    AdditionalTextInputProps {
  className?: string;
  modalStyle?: StyleProp<ViewStyle>;
  value?: Date;
  editable?: boolean;
  placeholder?: string;
  placeholderTextColor?: ColorValue;
  autoFocus?: boolean;
}
const DateTimePicker: React.FC<DateTimePickerProps & NativePickerProps> = React.forwardRef(
  (props, ref: any) => {
    let dateTimePickerRef = useRef<DateTimePickerModal>(null);

    const theme = useTheme();
    const { t } = useTranslation();

    const {
      title,
      titleProps,
      errorProps,
      leftIconProps,
      rightIconProps,
      name,
      modalStyle,
      value: valueProp,
      mode,
      editable,
      onConfirm,
      onCancel,
      placeholder,
      control,
      nextField,
      rules,
      ...otherProps
    } = props;

    const handledStyle = useMemo(() => handleInputStyle(props, theme), [props, theme]);
    const { placeholderTextColor, inactiveBorderColor, activeBorderColor } = handledStyle;

    const [value, setValue] = useState(valueProp);
    const [borderColor, setBorderColor] = useState(
      !props.autoFocus ? inactiveBorderColor : activeBorderColor,
    );
    useEffect(() => {
      setBorderColor(inactiveBorderColor);
    }, [inactiveBorderColor]);

    const convertValueToText = useCallback(
      (date?: Date) => {
        let text = placeholder;

        if (date) {
          switch (mode) {
            case 'datetime':
              text = `${moment(date).format(t('common.dateFormat'))} ${moment(date).format(
                t('common.timeFormat'),
              )}`;
              break;
            case 'time':
              text = moment(date).format(t('common.timeFormat'));
              break;
            default:
              text = moment(date).format(t('common.dateFormat'));
              break;
          }
        }
        return text;
      },
      [mode, placeholder, t],
    );

    const { control: formControl } = useForm({ mode: 'onTouched' });
    const { field, fieldState, formState } = useController({
      control: control || formControl,
      defaultValue: valueProp,
      rules,
      name: name || '',
    });

    const [isDatePickerVisible, setIsDatePickerVisible] = useState(false);

    const showDatePicker = async () => {
      if (!fieldState.error) {
        setBorderColor(activeBorderColor);
        await Helper.sleep(100);
      }
      setIsDatePickerVisible(true);
    };

    const hideDatePicker = () => {
      if (name && control) {
        field.onBlur();
      }
      setIsDatePickerVisible(false);
    };

    const handleConfirm = async (date: Date) => {
      setValue(date);
      onConfirm?.(date);

      hideDatePicker();

      if (name && control && date) {
        field.onChange(date);
        const isValidated = await nextField?.trigger(name);
        if (isValidated) {
          setBorderColor(inactiveBorderColor);
          if (nextField && !formState.touchedFields[nextField.name]) {
            await Helper.sleep(Platform.OS === 'android' ? 0 : 300);
            nextField?.setFocus(nextField.name);
          }
        }
      }
    };

    const handleCancel = (date: Date) => {
      if (!fieldState.error) {
        setBorderColor(inactiveBorderColor);
      }
      if (name && control) {
        field.onBlur();
      }

      onCancel?.(date);
      hideDatePicker();
    };

    useImperativeHandle(ref, () => ({
      ...dateTimePickerRef.current,
      value,
      setValue,
      focus: showDatePicker,
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
        e.focus = showDatePicker;
      }
      field.ref(e);
      dateTimePickerRef = {
        current: e,
      };
    };

    return (
      <View>
        <View testID="ContainerView" style={handledStyle.containerStyle}>
          {title ? (
            <Text testID="TitleText" {...titleProps} style={handledStyle.titleStyles}>
              {title}
            </Text>
          ) : null}

          <TouchableOpacity
            testID="DateTimePickerButton"
            activeOpacity={0.6}
            style={[handledStyle.inputContainerStyle, { borderColor }]}
            onPress={showDatePicker}
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
              testID="DateTimeText"
              {...(otherProps as any)}
              style={[
                handledStyle.otherStyle,
                { color: value ? handledStyle.otherStyle.color : placeholderTextColor },
              ]}
            >
              {convertValueToText(value)}
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
        </View>
        <DateTimePickerModal
          testID="DateTimePickerModal"
          ref={handleRef}
          display={Platform.OS === 'ios' ? 'inline' : 'default'}
          {...otherProps}
          style={modalStyle}
          isVisible={isDatePickerVisible}
          mode={mode}
          date={value}
          confirmTextIOS={t('common.confirm')}
          cancelTextIOS={t('common.cancel')}
          onConfirm={handleConfirm}
          onCancel={handleCancel}
        />
      </View>
    );
  },
);

DateTimePicker.defaultProps = {
  editable: true,
  placeholder: '',
};

export interface DateTimePickerType extends DateTimePickerModal {
  value: Date | undefined;
  setValue: (value: React.SetStateAction<Date | undefined>) => void;
  focus: () => void;
}

export default withTailwind(DateTimePicker) as React.FC<
  DateTimePickerProps & { ref?: React.LegacyRef<DateTimePickerModal> }
>;
