import React from 'react';
import Text from '@components/Common/Text';
import Config from 'react-native-config';
import View, { ViewProps } from '@components/Common/View/View';
import { useTranslation } from 'react-i18next';
import DeviceInfo from 'react-native-device-info';

export default function VersionText(props: ViewProps) {
  const { t } = useTranslation();

  return (
    <View {...props}>
      <View className="flex-row self-center">
        <Text className="mr-1 text-center">{t('common.version')}</Text>
        <Text testID="VersionText">{`${DeviceInfo.getVersion() || ''}.${
          DeviceInfo.getBuildNumber() || ''
        }${Config.NODE_ENV === 'production' ? '' : ` (${Config.NODE_ENV})`}`}</Text>
      </View>
    </View>
  );
}
