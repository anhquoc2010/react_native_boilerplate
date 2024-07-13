import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Button,
  DateTimePicker,
  ErrorText,
  Image,
  Input,
  KeyboardAvoidingScrollView,
  Picker,
  View,
} from '@components';
import Api, { TError } from '@utils/Api';
import Config from 'react-native-config';
import { useSafeAreaFrame, useSafeAreaInsets } from 'react-native-safe-area-context';
import { getDefaultHeaderHeight } from '@react-navigation/elements';
import AppView from '@utils/AppView';
import ImageSource from '@images';
import { useForm } from 'react-hook-form';
import { PATTERN_EMAIL } from '@validators';
import AppHelper from '@utils/AppHelper';
import moment from 'moment';

const InputExample: React.FC = () => {
  const { t } = useTranslation();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<TError | null>(null);

  const frame = useSafeAreaFrame();
  const insets = useSafeAreaInsets();
  const headerHeight = getDefaultHeaderHeight(frame, false, insets.top);

  const { control, handleSubmit, setFocus, trigger } = useForm({
    mode: 'onTouched',
    defaultValues: {
      email: __DEV__ ? Config.EMAIL : '',
      password: __DEV__ ? Config.PASSWORD : '',
      phoneNumber: '',
      username: '',
      gender: undefined,
      birthday: undefined,
    },
    shouldFocusError: false,
  });

  const onLogin = async (value: any) => {
    setLoading(true);
    try {
      // eslint-disable-next-line no-console
      console.log('Form Value:', value);
      setError(null);
      await Api.post('/auth/login', value);
    } catch (e: any) {
      setError(e);
    }
    setLoading(false);
  };

  return (
    <KeyboardAvoidingScrollView keyboardVerticalOffset={headerHeight}>
      <View style={{ paddingHorizontal: AppView.bodyPaddingHorizontal }}>
        <Image source={ImageSource.iconAppIOS} className="mb-2" />
        <ErrorText error={error} className="mb-2" />
        <Input
          testID="EmailInput"
          name="email"
          className="my-1.5 p-3"
          placeholder={t('field.email')}
          keyboardType="email-address"
          textContentType="emailAddress"
          autoComplete="email"
          autoCorrect={false}
          autoCapitalize="none"
          outline
          leftIconProps={{
            type: 'feather',
            name: 'mail',
          }}
          control={control}
          rules={{
            required: t('validator.required', { field: t('field.email') }),
            pattern: {
              value: PATTERN_EMAIL,
              message: t('validator.invalidEmail'),
            },
          }}
          nextField={{ name: 'password', setFocus, trigger }}
        />
        <Input
          testID="PasswordInput"
          name="password"
          className="my-1.5 p-3"
          placeholder={t('field.password')}
          secureTextEntry
          textContentType="password"
          autoComplete="password"
          autoCorrect={false}
          autoCapitalize="none"
          outline
          leftIconProps={{
            type: 'feather',
            name: 'lock',
          }}
          control={control}
          rules={{
            required: t('validator.required', { field: t('field.password') }),
            minLength: {
              value: 6,
              message: t('validator.tooShort'),
            },
          }}
          nextField={{ name: 'username', setFocus, trigger }}
        />
        <Input
          name="username"
          className="my-1.5 p-3"
          leftIconProps={{
            type: 'feather',
            name: 'user',
          }}
          title={t('field.username')}
          placeholder={t('field.username')}
          autoComplete="username"
          control={control}
          nextField={{ name: 'birthday', setFocus, trigger }}
        />
        <DateTimePicker
          name="birthday"
          className="my-1.5 p-3"
          outline
          placeholder={t('field.birthday')}
          leftIconProps={{
            type: 'feather',
            name: 'calendar',
          }}
          maximumDate={moment().toDate()}
          control={control}
          rules={{
            required: t('validator.required', { field: t('field.birthday') }),
          }}
          nextField={{ name: 'gender', setFocus, trigger }}
        />
        <Picker
          outline
          name="gender"
          options={[t('field.male'), t('field.female')]}
          placeholder={t('field.gender')}
          className="my-1.5 p-3"
          leftIconProps={{
            type: 'fontisto',
            name: 'transgender',
            size: 18,
          }}
          control={control}
          rules={{
            required: t('validator.required', { field: t('field.gender') }),
          }}
          nextField={{ name: 'phoneNumber', setFocus, trigger }}
        />
        <Input
          name="phoneNumber"
          className="my-5 p-3"
          leftIconProps={{
            type: 'feather',
            name: 'phone',
          }}
          rightIconProps={{
            type: 'feather',
            name: 'phone',
          }}
          keyboardType="phone-pad"
          autoComplete="tel"
          placeholder={t('field.phoneNumber')}
          clear
          control={control}
        />
        <Button
          className="mb-4"
          title={t('common.submit')}
          loading={loading}
          onPress={handleSubmit(onLogin, err => AppHelper.focusInvalidField(err, setFocus))}
          // onPress={handleSubmit(onLogin)}
        />
      </View>
    </KeyboardAvoidingScrollView>
  );
};

export default InputExample;
