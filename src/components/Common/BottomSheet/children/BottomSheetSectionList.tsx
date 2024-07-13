import React from 'react';
import withTailwind from '@components/hoc/withTailwind';
import { BottomSheetSectionList as RNBottomSheetSectionList } from '@gorhom/bottom-sheet';
import { BottomSheetSectionListProps as RNBottomSheetSectionListProps } from '@gorhom/bottom-sheet/lib/typescript/components/bottomSheetScrollable/types';

interface BottomSheetSectionListProps extends RNBottomSheetSectionListProps<any, any> {}

const BottomSheetSectionList: React.FC<BottomSheetSectionListProps> = React.forwardRef(
  (props, ref: any) => {
    const { ...otherProps } = props;

    return (
      <RNBottomSheetSectionList
        testID="BottomSheetSectionList"
        // @ts-ignore
        ref={ref}
        {...otherProps}
      />
    );
  },
);

BottomSheetSectionList.defaultProps = {};

export default withTailwind(BottomSheetSectionList) as React.FC<
  BottomSheetSectionListProps & { ref?: any }
>;
