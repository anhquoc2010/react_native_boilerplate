import React from 'react';
import withTailwind from '@components/hoc/withTailwind';
import { BottomSheetFlatList as RNBottomSheetFlatList } from '@gorhom/bottom-sheet';
import { BottomSheetFlatListProps as RNBottomSheetFlatListProps } from '@gorhom/bottom-sheet/lib/typescript/components/bottomSheetScrollable/types';

interface BottomSheetFlatListProps extends RNBottomSheetFlatListProps<any> {}

const BottomSheetFlatList: React.FC<BottomSheetFlatListProps> = React.forwardRef(
  (props, ref: any) => {
    const { ...otherProps } = props;

    return (
      <RNBottomSheetFlatList
        testID="BottomSheetFlatList"
        // @ts-ignore
        ref={ref}
        {...otherProps}
      />
    );
  },
);

BottomSheetFlatList.defaultProps = {};

export default withTailwind(BottomSheetFlatList) as React.FC<
  BottomSheetFlatListProps & { ref?: any }
>;
