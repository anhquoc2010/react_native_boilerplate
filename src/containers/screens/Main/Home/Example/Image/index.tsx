import React from 'react';
import { Image, ScrollView, View } from '@components';
import ImageSource from '@images';
import travel from './data/travel';
import { useTheme } from '@react-navigation/native';
import AppView from '@utils/AppView';

interface Props {}

const ImageExample: React.FC<Props> = () => {
  const theme = useTheme();
  return (
    <ScrollView className="flex-1">
      <View style={{ paddingHorizontal: AppView.bodyPaddingHorizontal }}>
        <Image
          source={{
            uri: 'https://images.unsplash.com/photo-1518005020951-eccb494ad742?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1500&q=80',
          }}
          className="self-center my-1.5"
          width={200}
          autoHeight
          viewEnable
        />
        <Image
          source={travel[2]}
          multipleSources={travel}
          className="self-center my-1.5 bg-black/10"
          viewEnable
        />
        <Image className="self-center my-1.5" source={ImageSource.iconAppIOS} viewEnable />
        <Image
          source={{
            uri: 'https://images.unsplash.com/photo-1429823040067-2c31b1d637ae?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1500&q=80',
          }}
          sharp
          className="w-24 h-24 self-center my-1.5"
          viewEnable
        />
        <Image
          source={{
            uri: 'https://images.unsplash.com/photo-1445264918150-66a2371142a2?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1500&q=80',
          }}
          className="w-24 h-24 self-center my-1.5"
          viewEnable
        />
        <Image
          source={{
            uri: 'https://images.unsplash.com/photo-1480374178950-b2c449be122e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1500&q=80',
          }}
          className="w-24 h-24 self-center my-1.5 rounded-full"
          viewEnable
        />
        <Image
          source={{
            uri: 'https://i.chzbgr.com/full/8370322944/hADACEF88/im-gonna-kiss-you-then-bite-you',
          }}
          className="self-center my-1.5"
          // Fix borderRadius on Android GIF Image
          style={{ overlayColor: theme.colors.background }}
          viewEnable
        />
      </View>
    </ScrollView>
  );
};

export default ImageExample;
