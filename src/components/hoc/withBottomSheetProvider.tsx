import BottomSheetProvider from '@components/Common/BottomSheet/BottomSheetProvider';
import React, { FC } from 'react';
import { Platform } from 'react-native';

/* istanbul ignore next */
const withBottomSheetProvider = (Component: FC) => () =>
  Platform.OS === 'android' ? (
    <BottomSheetProvider>
      <Component />
    </BottomSheetProvider>
  ) : (
    <Component />
  );

export default withBottomSheetProvider;
