import React from 'react';
import withTailwind from '@components/hoc/withTailwind';
import { BottomSheetScrollView as RNBottomSheetScrollView } from '@gorhom/bottom-sheet';
import { BottomSheetScrollViewProps as RNBottomSheetScrollViewProps } from '@gorhom/bottom-sheet/lib/typescript/components/bottomSheetScrollable/types';

interface BottomSheetScrollViewProps extends RNBottomSheetScrollViewProps {}

const BottomSheetScrollView: React.FC<BottomSheetScrollViewProps> = React.forwardRef(
  (props, ref: any) => {
    const { ...otherProps } = props;

    return (
      <RNBottomSheetScrollView
        testID="BottomSheetScrollView"
        // @ts-ignore
        ref={ref}
        {...otherProps}
      />
    );
  },
);

BottomSheetScrollView.defaultProps = {};

export default withTailwind(BottomSheetScrollView) as React.FC<
  BottomSheetScrollViewProps & { ref?: any }
>;
