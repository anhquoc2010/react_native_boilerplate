/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Text, View } from '@components';
import AppView from '@utils/AppView';

interface Props {}

const Register: React.FC<Props> = () => {
  const { t } = useTranslation();

  return (
    <View className="flex-1">
      <View style={{ paddingHorizontal: AppView.bodyPaddingHorizontal }}>
        <Text className="my-1">Register</Text>
      </View>
    </View>
  );
};

export default Register;
