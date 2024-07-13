import React, { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Text, View, ScrollView, Icon } from '@components';
import { ViewType } from '@components/Common/View/View';
import AppView from '@utils/AppView';

const TextExample: React.FC = () => {
  const { t } = useTranslation();
  const textRef = useRef<ViewType>(null);
  return (
    <ScrollView className="flex-1">
      <View style={{ paddingHorizontal: AppView.bodyPaddingHorizontal }}>
        <Text className="mt-1" ref={textRef}>
          {t('common.letsGetStarted')}
        </Text>
        <Text primary className="mt-1">
          Primary
        </Text>
        <Text className="mt-1 font-thin">Thin</Text>
        <Text className="mt-1 font-extralight">ExtraLight</Text>
        <Text className="mt-1 font-light">Light</Text>
        <Text className="mt-1 font-normal">Normal</Text>
        <Text className="mt-1 font-semibold">SemiBold</Text>
        <Text className="mt-1 font-bold">Bold</Text>
        <Text className="mt-1 font-extrabold">ExtraBold</Text>
        <Text className="mt-1 font-black">Black</Text>
        <Text className="mt-1 italic">Italic</Text>
        <Text className="mt-1 underline">Underline</Text>
        <View className="mt-1 flex-row items-center">
          <Icon type="material-community" name="arrow-left" />
          <Text>Text with Icon</Text>
        </View>
        <Text className="mt-1 font-GoogleSans">GoogleSans</Text>
        <Text className="mt-1 font-SVNPoppins">SVNPoppins</Text>
        <Text className="mt-1 text-blue-700 dark:text-blue-300">TailwindColor</Text>
        <Text className="mt-1 text-color-notification">ThemeColor</Text>
        <Text className="mt-1 text-xs">xs</Text>
        <Text className="mt-1 text-sm">sm</Text>
        <Text className="mt-1 text-lg">lg</Text>
        <Text className="mt-1 text-xl">xl</Text>
        <Text className="mt-1 text-2xl">2xl</Text>
        <Text className="mt-1 text-3xl">3xl</Text>
        <Text className="mt-1 text-4xl">4xl</Text>
      </View>
    </ScrollView>
  );
};

export default TextExample;
