import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { View, ScrollView, Button } from '@components';
import AppView from '@utils/AppView';

const ButtonExample: React.FC = () => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);

  return (
    <ScrollView testID="ButtonExample" className="flex-1">
      <View style={{ paddingHorizontal: AppView.bodyPaddingHorizontal }}>
        <Button title={t('common.ok')} className="my-2" />
        <Button title="Outline" outline className="my-2" />
        <Button title="Clear" clear className="my-2" />
        <Button title="Disabled" className="my-2" disabled />
        <Button
          title="Loading"
          className="my-2"
          loading={loading}
          onPress={() => setLoading(!loading)}
        />
        <Button title="Custom background color" className="my-2 bg-teal-500" />
        <Button title="Theme background color" className="my-2 bg-color-grey5 text-color-grey2" />
        <Button
          title="Button with custom dimension"
          className="my-2"
          style={{ width: 320, height: 80 }}
        />
        <Button
          title="Button with custom dimension"
          className="my-2"
          outline
          style={{ width: 320, height: 80 }}
        />
        <Button
          title="With Icon"
          className="my-2 self-center"
          leftIconProps={{
            type: 'material-community',
            name: 'arrow-left',
          }}
          rightIconProps={{
            type: 'material-community',
            name: 'arrow-right',
          }}
        />
        <Button
          title="Clear Icon with margin=0"
          clear
          className="self-start my-2"
          textStyle={{ margin: 0 }}
        />
        <Button
          className="my-2 self-center rounded-full w-14 h-14"
          leftIconProps={{
            type: 'material-community',
            name: 'check',
            size: 32,
          }}
        />
      </View>
    </ScrollView>
  );
};

export default ButtonExample;
