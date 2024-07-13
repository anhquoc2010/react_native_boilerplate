import React from 'react';
import { ErrorText, Loading, ScrollView, Text, View, Image } from '@components';
import AppView from '@utils/AppView';
import { useTranslation } from 'react-i18next';
import AppHelper from '@utils/AppHelper';
import { useRequest } from '@components/hooks';

interface Props {}

const Detail: React.FC<Props> = (props: Props) => {
  const { i18n } = useTranslation();

  const item = AppHelper.getDataFromParams(props);

  const { loading, data, error } = useRequest(`/posts/${item.id}`, { defaultData: item });

  const renderFetchedContent = () => {
    if (loading) {
      return <Loading />;
    }
    if (error) {
      return <ErrorText error={error} />;
    }

    return (
      <View>
        <Text className="my-2" numberOfLines={3}>
          {data?.description}
        </Text>
      </View>
    );
  };

  return (
    <ScrollView className="flex-1">
      <View style={{ paddingHorizontal: AppView.bodyPaddingHorizontal }}>
        <Text className="font-semibold text-xl my-2 text-center text-color-info">
          {data?.[`${i18n.language}Title`]}
        </Text>
        <Image source={{ uri: data?.thumbnail }} height={300} viewEnable />
        <View className="my-2">{renderFetchedContent()}</View>
      </View>
    </ScrollView>
  );
};

export default Detail;
