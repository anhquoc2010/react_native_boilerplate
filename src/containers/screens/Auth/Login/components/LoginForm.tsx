import React from 'react';
import { useAppDispatch, useAppSelector } from '@utils/Redux';
import { useTranslation } from 'react-i18next';
import { Button, Input, Text, View, ErrorText } from '@components';
import { login } from '@store/auth';
import { useForm } from 'react-hook-form';
import { PATTERN_EMAIL } from '@validators';
import Config from 'react-native-config';

export default function LoginForm() {
  const [loading, error] = useAppSelector(state => [state.auth.loading, state.auth.error]);
  const dispatch = useAppDispatch();
  const { t } = useTranslation();

  const { control, handleSubmit, setFocus, trigger } = useForm({
    mode: 'onTouched',
    defaultValues: {
      email: __DEV__ ? Config.EMAIL : '',
      password: __DEV__ ? Config.PASSWORD : '',
    },
  });

  const onLogin = (value: Auth.Login) => {
    dispatch(login(value));
  };

  return (
    <View className="p-8 rounded-xl bg-color-card">
      <Text className="mb-5 text-xl font-bold text-color-primary">{t('common.welcome')}</Text>
      <ErrorText error={error} className="-mt-3 mb-3" />
      <Input
        testID="EmailInput"
        name="email"
        className="p-3"
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
        className="mt-3 p-3"
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
      />
      <Button
        testID="LoginButton"
        className="mt-5 py-1"
        title={t('auth.login')}
        loading={loading}
        onPress={handleSubmit(onLogin as any)}
      />
    </View>
  );
}
