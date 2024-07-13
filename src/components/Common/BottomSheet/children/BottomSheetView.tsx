import React from 'react';
import withTailwind from '@components/hoc/withTailwind';
import { BottomSheetView as RNBottomSheetView } from '@gorhom/bottom-sheet';
import { BottomSheetViewProps as RNBottomSheetViewProps } from '@gorhom/bottom-sheet/lib/typescript/components/bottomSheetView/types';

interface BottomSheetViewProps extends RNBottomSheetViewProps {}

const BottomSheetView: React.FC<BottomSheetViewProps> = React.forwardRef((props, ref: any) => {
  const { ...otherProps } = props;

  return (
    <RNBottomSheetView
      testID="BottomSheetView"
      // @ts-ignore
      ref={ref}
      {...otherProps}
    />
  );
});

BottomSheetView.defaultProps = {};

export default withTailwind(BottomSheetView) as React.FC<BottomSheetViewProps & { ref?: any }>;
