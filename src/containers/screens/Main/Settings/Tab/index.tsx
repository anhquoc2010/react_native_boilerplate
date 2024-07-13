import React from 'react';
import { Icon, Text, Touchable, View, VersionText, Switch } from '@components';
import { FlatList, Platform } from 'react-native';
import { useTranslation } from 'react-i18next';
import { changeLanguage, switchTheme } from '@store/app';
import { useActionSheet } from '@expo/react-native-action-sheet';
import { logout } from '@store/auth';
import { useModal } from '@components/hooks';
import { useTheme } from '@react-navigation/native';

type Item = { leftIcon: any; title: string; rightElement?: React.ReactNode; onPress?: () => void };

const SettingsTab: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { showActionSheetWithOptions } = useActionSheet();
  const { alert } = useModal();
  const theme = useTheme();

  const renderItem = ({ item }: { item: Item }) => {
    const { leftIcon, title, rightElement, onPress } = item;
    return (
      <Touchable
        testID={item.title}
        onPress={onPress}
        disabled={!onPress}
        className="flex-row bg-color-card p-3 items-center rounded-lg justify-between my-1.5"
      >
        <View className="flex-row items-center">
          <Icon type="ionicon" name={leftIcon} size={18} className="w-7 text-color-grey3" />
          <Text className="text-base">{title}</Text>
        </View>
        <View>{rightElement}</View>
      </Touchable>
    );
  };

  const onOpenLanguagePicker = () => {
    const languageKey = ['en', 'vi'];
    showActionSheetWithOptions(
      {
        options: [
          t(`languageKey.${languageKey[0]}`),
          t(`languageKey.${languageKey[1]}`),
          t('common.cancel'),
        ],
        destructiveButtonIndex: Platform.OS === 'android' ? 2 : undefined,
        cancelButtonIndex: 2,
        userInterfaceStyle: theme.dark ? 'dark' : 'light',
      },
      buttonIndex => {
        /* istanbul ignore else */
        if (buttonIndex !== undefined) {
          global.app.dispatch(changeLanguage(languageKey[buttonIndex]));
        }
      },
    );
  };

  const data: Item[] = [
    {
      leftIcon: 'moon-outline',
      title: t('common.darkTheme'),
      rightElement: (
        <Switch
          testID="ThemeSwitch"
          onValueChange={() => {
            global.app.dispatch(switchTheme());
          }}
          value={theme.dark}
        />
      ),
    },
    {
      leftIcon: 'language',
      title: t('common.language'),
      rightElement: (
        <View className="flex-row items-center">
          <Text className="mr-1 text-base text-color-grey0">
            {t(`languageKey.${i18n.language}`)}
          </Text>
          <Icon className="text-color-primary" type="ionicon" name="chevron-down" size={18} />
        </View>
      ),
      onPress: onOpenLanguagePicker,
    },
    {
      leftIcon: 'exit-outline',
      title: t('auth.logout'),
      onPress: () => {
        alert({
          title: t('common.confirmation'),
          description: t('auth.logoutDescription'),
          okTitle: t('auth.logout'),
          showCancel: true,
          reverseButtonPosition: true,
          onOkButtonPress: () => {
            setTimeout(() => {
              global.app.dispatch(logout());
            }, 150);
          },
        });
      },
    },
  ];

  return (
    <>
      <View style={{ flex: 1 }}>
        <View style={{ flex: 9.5 }}>
          <FlatList
            data={data}
            renderItem={renderItem}
            contentContainerStyle={{
              paddingVertical: 8,
              paddingHorizontal: 16,
            }}
          />
        </View>
        <View style={{ flex: 0.5, justifyContent: 'center' }}>
          <VersionText />
        </View>
      </View>
    </>
  );
};

export default SettingsTab;
