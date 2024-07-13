import React, { useRef } from 'react';
import { useTheme } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { Image, Input, Text, Touchable, View } from '@components';
import AppView from '@utils/AppView';
import Navigation from '@utils/Navigation';
import AppHelper from '@utils/AppHelper';
import _ from 'lodash';
import { InputType } from '@components/Common/Input';
import { useListRequest } from '@components/hooks';

const List: React.FC = () => {
  const searchRef = useRef<InputType>(null);
  const theme = useTheme();
  const { t } = useTranslation();

  // const modifyData = (data: any) => {
  //   const newData = [...data];
  //   newData.forEach((e, i) => {
  //     newData[i].title = 'abcd';
  //   });
  //   return newData;
  // };

  const { renderFlatList, refresh } = useListRequest('/posts');

  // Search
  const search = _.debounce(async text => {
    refresh({
      showRefreshing: true,
      queryParams: { s: JSON.stringify({ title: { $contL: text } }) },
    });
  }, 1000);

  const onChangeText = (text: string) => {
    search(text);
  };

  const renderItem = ({ item }: any) => (
    <Touchable
      onPress={() => Navigation.navigate('Detail', AppHelper.setDataIntoParams(item))}
      className="rounded-lg my-2 bg-color-white"
      style={{ ...AppView.shadow() }}
    >
      <Image source={{ uri: item.thumbnail }} height={200} />
      <View className="p-3">
        <Text
          className="font-semibold"
          style={{ fontSize: 18 }}
          numberOfLines={2}
          color={theme.colors.info}
        >
          {item.title}
        </Text>
        <Text className="my-2 italic" numberOfLines={3}>
          {item.description}
        </Text>
      </View>
    </Touchable>
  );

  const clearFilter = () => {
    if (searchRef.current) {
      searchRef.current.clear();
    }
    search('');
  };

  return (
    <View className="flex-1">
      <Input
        ref={searchRef}
        placeholder={t('component.input.searchPlaceholder')}
        leftIconProps={{ name: 'search', type: 'material', size: 24 }}
        rightIconProps={{ name: 'close', type: 'material', size: 24, onPress: clearFilter }}
        style={{
          marginHorizontal: AppView.bodyPaddingHorizontal,
          marginBottom: 6,
        }}
        autoComplete="off"
        autoCorrect={false}
        onChangeText={onChangeText}
        returnKeyType="search"
      />
      {renderFlatList({
        renderItem,
        contentContainerStyle: {
          paddingHorizontal: AppView.bodyPaddingHorizontal,
          paddingVertical: 6,
        },
      })}
    </View>
  );
};

export default List;
