import React, { useRef, useImperativeHandle } from 'react';
import {
  BottomSheetModal as RNBottomSheetModal,
  BottomSheetProps as RNBottomSheetProps,
} from '@gorhom/bottom-sheet';
import { SharedValue } from 'react-native-reanimated';
import HandleComponent, { HandleComponentProps } from './components/HandleComponent';
import BackdropComponent, { BackdropComponentProps } from './components/BackdropComponent';
import BackgroundComponent from './components/BackgroundComponent';
import AppView from '@utils/AppView';
import withTailwind from '@components/hoc/withTailwind';

export interface BottomSheetProps extends Omit<RNBottomSheetProps, 'snapPoints'> {
  className?: string;
  snapPoints?: Array<string | number> | SharedValue<Array<string | number>>;
  headerProps?: HandleComponentProps;
  backdropProps?: BackdropComponentProps;
  title?: string | JSX.Element;
  showCloseIcon?: boolean;
}

const BottomSheet: React.FC<BottomSheetProps> = React.forwardRef((props, ref: any) => {
  const bottomSheetModalRef = useRef<RNBottomSheetModal>(null);

  const {
    backdropProps,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    headerProps,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    backdropComponent,
    title,
    showCloseIcon,
    style: styleProp,
    ...otherProps
  } = props;
  const style: BottomSheetProps['style'] = [AppView.shadow(20), styleProp];

  const onClose = showCloseIcon ? () => bottomSheetModalRef.current?.close() : undefined;

  useImperativeHandle(ref, () => ({
    ...bottomSheetModalRef.current,
  }));

  return (
    <RNBottomSheetModal
      ref={bottomSheetModalRef}
      backdropComponent={componentProps => (
        <BackdropComponent {...componentProps} {...backdropProps} />
      )}
      backgroundComponent={componentProps => <BackgroundComponent {...componentProps} />}
      handleComponent={componentProps => (
        <HandleComponent {...componentProps} onClose={onClose} children={title} />
      )}
      index={1}
      enablePanDownToClose
      {...(otherProps as any)}
      style={style}
    >
      {props.children}
    </RNBottomSheetModal>
  );
});

BottomSheet.defaultProps = {
  snapPoints: ['25%', '50%', '90%'],
};
export interface BottomSheetType extends RNBottomSheetModal {}

export default withTailwind(BottomSheet) as React.FC<
  BottomSheetProps & { ref?: React.LegacyRef<RNBottomSheetModal> }
>;
