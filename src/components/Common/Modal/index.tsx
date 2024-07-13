import { StyleProp, View, ViewStyle } from 'react-native';
import React, { useEffect, useImperativeHandle, useRef, useState } from 'react';
import withTailwind from '@components/hoc/withTailwind';
import RNModal, { ModalProps as RNModalProps } from 'react-native-modal';
import { useTheme } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import Text from '../Text';
import AppView from '@utils/AppView';
import Button from '../Button';
import { Icon, Loading } from '@components';

export interface ModalProps extends Partial<RNModalProps> {
  alert?: {
    title?: string;
    description?: string;
    type?: 'success' | 'error';
    loading?: boolean;
    onOkButtonPress?: Function;
    onCancelButtonPress?: Function;
    okTitle?: string;
    cancelTitle?: string;
    reverseButtonPosition?: boolean;
    showCancel?: boolean;
    width?: number;
    height?: number;
    buttonStyle?: StyleProp<ViewStyle>;
  };
  className?: string;
  backdropClose?: boolean;
}

const Modal: React.FC<Omit<ModalProps, 'children'> & { children: React.ReactNode }> =
  React.forwardRef((props, ref: any) => {
    const modalRef = useRef<RNModal>(null);

    const theme = useTheme();
    const { t } = useTranslation();

    const {
      style: styleProp,
      isVisible: isVisibleProp,
      onBackdropPress: onBackdropPressProp,
      backdropClose: backdropCloseProp,
      alert,
      ...otherProps
    } = props;

    const backdropClose = alert?.loading ? false : backdropCloseProp;

    const style: StyleProp<ViewStyle> = [styleProp];

    const [isVisible, setIsVisible] = useState(isVisibleProp);
    const [forwardData, setForwardData] = useState(null);

    const trigger = (nextIsVisible?: boolean) => {
      if (nextIsVisible === undefined) {
        setIsVisible(!isVisible);
      } else {
        setIsVisible(nextIsVisible);
      }
    };

    const renderChildren = () => {
      const listOfProps: any = {
        close: () => setIsVisible(false),
      };
      if (forwardData) {
        listOfProps.forwardData = forwardData;
      }
      const nodeWithProps = React.cloneElement(otherProps.children as any, listOfProps);
      return nodeWithProps;
    };

    useEffect(() => {
      setIsVisible(isVisibleProp);
    }, [isVisibleProp]);

    useImperativeHandle(ref, () => ({
      ...modalRef.current,
      trigger,
      setForwardData,
    }));

    if (alert) {
      otherProps.animationIn = 'zoomIn';
      otherProps.animationOut = 'zoomOut';
      otherProps.animationInTiming = 150;
      otherProps.animationOutTiming = 150;
      otherProps.backdropTransitionInTiming = 150;
      otherProps.backdropTransitionOutTiming = 0;

      const modalWidth = alert.width || AppView.bodyWidth;
      const onCancel = () => {
        setIsVisible(false);
        if (alert.onCancelButtonPress) {
          alert.onCancelButtonPress();
        }
      };

      const onOk = () => {
        setIsVisible(false);
        if (alert.onOkButtonPress) {
          alert.onOkButtonPress();
        }
      };

      if (typeof alert.loading !== 'undefined') {
        otherProps.children = (
          <View className="bg-color-card py-5 px-7 rounded self-center justify-center">
            <Loading testID="Loading" size="large" className="mt-1" />
            <Text className="text-color-primary text-center text-lg font-bold my-1">
              {alert.title || t('common.loading')}
            </Text>
          </View>
        );
      } else {
        otherProps.children = (
          <View
            className="bg-color-card p-4 rounded self-center justify-center"
            style={{
              width: modalWidth,
              height: alert.height,
            }}
          >
            {alert.type === 'success' || alert.type === 'error' ? (
              <Icon
                testID={alert.type === 'success' ? 'SuccessIcon' : 'ErrorIcon'}
                type="antdesign"
                name={alert.type === 'success' ? 'checkcircle' : 'closecircle'}
                className="self-center my-2"
                color={alert.type === 'success' ? theme.colors.success : theme.colors.error}
                style={{ transform: [{ rotateZ: '-5deg' }] }}
                size={50}
              />
            ) : null}
            {alert.title ? (
              <Text
                testID="TitleText"
                className="text-center text-xl font-semibold my-1"
                color={!alert.type ? theme.colors.primary : theme.colors.grey0}
              >
                {alert.title}
              </Text>
            ) : null}
            {alert.description ? (
              <Text
                testID="DescriptionText"
                className="text-center text-base my-1"
                color={theme.colors.grey0}
              >
                {alert.description}
              </Text>
            ) : null}
            <View
              style={{
                flexDirection: alert.reverseButtonPosition ? 'row-reverse' : 'row',
                justifyContent: !alert.showCancel ? 'center' : 'space-between',
                alignItems: 'center',
                paddingVertical: 16,
              }}
            >
              {alert.showCancel ? (
                <Button
                  testID="CancelButton"
                  title={alert.cancelTitle || t('common.cancel')}
                  outline={!alert.reverseButtonPosition}
                  style={[
                    {
                      width: (modalWidth - 50) / 2,
                      alignItems: 'center',
                    },
                    alert.buttonStyle,
                  ]}
                  onPress={onCancel}
                />
              ) : null}
              <Button
                testID="OkButton"
                title={alert.okTitle || t('common.ok')}
                outline={alert.reverseButtonPosition}
                style={[
                  {
                    width: !alert.showCancel ? modalWidth - 50 : (modalWidth - 50) / 2,
                    alignItems: 'center',
                  },
                  alert.buttonStyle,
                ]}
                onPress={onOk}
              />
            </View>
          </View>
        );
      }
    }

    const onBackdropPress = () => {
      if (backdropClose) {
        setIsVisible(false);
      }
      onBackdropPressProp?.();
    };

    return (
      <RNModal
        testID="Modal"
        ref={modalRef}
        statusBarTranslucent={!!alert}
        deviceHeight={
          alert
            ? AppView.windowHeight + AppView.safeAreaInsets.top + AppView.safeAreaInsets.bottom
            : undefined
        }
        backdropTransitionOutTiming={0}
        {...otherProps}
        isVisible={isVisible}
        onBackdropPress={onBackdropPress}
        style={style}
      >
        {renderChildren()}
      </RNModal>
    );
  });

Modal.defaultProps = {
  backdropClose: true,
};

export interface ModalType extends RNModal {
  trigger: (nextIsVisible?: boolean) => void;
  setForwardData: (newForwardData: any) => void;
}

export default withTailwind(Modal) as React.FC<ModalProps & { ref?: React.LegacyRef<RNModal> }>;
