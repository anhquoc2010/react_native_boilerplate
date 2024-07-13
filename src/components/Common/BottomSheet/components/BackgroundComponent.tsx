import React from 'react';
import { View } from '@components';
import { BottomSheetBackgroundProps } from '@gorhom/bottom-sheet';

interface Props extends BottomSheetBackgroundProps {}

const BackgroundComponent: React.FC<Props> = () => (
  <View className="bg-color-card absolute top-0 left-0 right-0 bottom-0 rounded-t-card" />
);

export default BackgroundComponent;
