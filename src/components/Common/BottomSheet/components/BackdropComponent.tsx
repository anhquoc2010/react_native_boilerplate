import React from 'react';
import { BottomSheetDefaultBackdropProps } from '@gorhom/bottom-sheet/lib/typescript/components/bottomSheetBackdrop/types';
import { BottomSheetBackdrop } from '@gorhom/bottom-sheet';

export interface BackdropComponentProps extends BottomSheetDefaultBackdropProps {}

const BackdropComponent: React.FC<BackdropComponentProps> = (props: BackdropComponentProps) => (
  <BottomSheetBackdrop pressBehavior="close" {...props} />
);

export default BackdropComponent;
