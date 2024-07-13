import React, { useEffect, useState } from 'react';
import { useTheme } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { BottomSheetView, Button, Input, Modal, ScrollView, Text, View } from '@components';
import AppView from '@utils/AppView';
import { useBottomSheet, useModal } from '@components/hooks';
import { ModalViewContent, Navigator } from './ModalContent';
import { BottomSheetTextInput, useBottomSheetDynamicSnapPoints } from '@gorhom/bottom-sheet';
import { withBottomSheetProvider } from '@components/hoc';
import { Platform } from 'react-native';

const Constants = {
  CustomModal: 'CustomModal',
  FancyModal: 'FancyModal',
  DefaultBottomSheet: 'DefaultBottomSheet',
  KeyboardHandlingBottomSheet: 'KeyboardHandlingBottomSheet',
  DynamicBottomSheet: 'DynamicBottomSheet',
  StackBottomSheet: 'StackBottomSheet',
};

const CustomModalContent = (props: any) => {
  const { forwardData } = props;

  return (
    <View className="h-1/2 bg-color-card">
      <View
        className="mt-4 bg-color-background"
        style={{
          marginBottom: AppView.safeAreaInsets.bottom,
        }}
      >
        <ScrollView showsVerticalScrollIndicator={false} className="bg-color-card">
          <Text className="text-center text-lg mb-1">{forwardData?.content}</Text>
          <ModalViewContent />
        </ScrollView>
      </View>
    </View>
  );
};

const ModalExample: React.FC = () => {
  const theme = useTheme();
  const { t } = useTranslation();

  const { alert, getModal, setModal } = useModal();
  const { getBottomSheet, setBottomSheet } = useBottomSheet();

  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setModal(Constants.CustomModal, {
      style: { justifyContent: 'flex-end', margin: 0 },
      children: <CustomModalContent />,
    });

    setModal(Constants.FancyModal, {
      children: (
        <View className="bg-color-background rounded-[10px] p-[30px] w-[200px] self-center">
          <Text className="text-center">Hi 👋!</Text>
          <Button
            title="Close"
            className="mt-5"
            onPress={() => {
              const fancyModal = getModal(Constants.FancyModal);
              fancyModal?.trigger(false);
            }}
          />
        </View>
      ),
      backdropColor: '#B4B3DB',
      backdropOpacity: 0.8,
      animationIn: 'zoomInDown',
      animationOut: 'zoomOutUp',
      animationInTiming: 600,
      animationOutTiming: 600,
      backdropTransitionInTiming: 600,
      backdropTransitionOutTiming: 600,
    });

    setBottomSheet(Constants.DefaultBottomSheet, {
      title: 'Default Bottom Sheet',
      children: <Text className="text-center">Hi 👋</Text>,
    });

    setBottomSheet(Constants.KeyboardHandlingBottomSheet, {
      title: 'Keyboard Handling Bottom Sheet',
      keyboardBehavior: 'interactive',
      keyboardBlurBehavior: 'restore',
      snapPoints: [200, 400],
      index: 0,
      children: (
        <View style={{ marginHorizontal: AppView.bodyPaddingHorizontal }}>
          <Input
            component={Platform.OS === 'ios' ? BottomSheetTextInput : undefined}
            placeholder={t('component.input.searchPlaceholder')}
          />
        </View>
      ),
    });

    setBottomSheet(Constants.StackBottomSheet, {
      children: Navigator,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [theme]);

  const { animatedHandleHeight, animatedSnapPoints, animatedContentHeight, handleContentLayout } =
    useBottomSheetDynamicSnapPoints(['CONTENT_HEIGHT']);

  useEffect(() => {
    setBottomSheet(Constants.DynamicBottomSheet, {
      title: 'Dynamic Bottom Sheet',
      showCloseIcon: true,
      snapPoints: animatedSnapPoints,
      handleHeight: animatedHandleHeight,
      contentHeight: animatedContentHeight,
      index: 0,
      keyboardBehavior: 'interactive',
      keyboardBlurBehavior: 'restore',
      children: (
        <BottomSheetView className="pt-3 pb-1.5 px-6" onLayout={handleContentLayout}>
          <View style={{ height: 250 }}>
            <Text className="text-[156px] text-center self-center">😍</Text>
          </View>
        </BottomSheetView>
      ),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [animatedHandleHeight, animatedSnapPoints, animatedContentHeight, handleContentLayout]);

  return (
    <View className="flex-1" style={{ flex: 1 }}>
      <ScrollView className="flex-1">
        <View style={{ paddingHorizontal: AppView.bodyPaddingHorizontal }}>
          <Button title="Native Modal" className="my-2" onPress={() => setIsVisible(true)} />
          <Button
            title="Notification Modal"
            className="my-2"
            onPress={() => {
              alert({
                title: 'Successful 🚀',
                // eslint-disable-next-line no-console
                onOkButtonPress: () => console.log('Successful'),
                buttonStyle: { width: 130 },
                width: 200,
              });
            }}
          />
          <Button
            title="Success Modal"
            className="my-2"
            onPress={() => {
              alert({
                title: t('common.submitSuccess'),
                type: 'success',
              });
            }}
          />
          <Button
            title="Error Modal"
            className="my-2"
            onPress={() => {
              alert({
                title: t('common.submitFail'),
                type: 'error',
              });
            }}
          />
          <Button
            title="Confirmation Modal"
            className="my-2"
            onPress={() => {
              alert({
                title: t('common.confirmation'),
                description: t('auth.logoutDescription'),
                okTitle: t('auth.logout'),
                showCancel: true,
                reverseButtonPosition: true,
                onOkButtonPress: () => {
                  // eslint-disable-next-line no-console
                  console.log('Logout');
                },
              });
            }}
          />
          <Button
            title="Loading Modal"
            className="my-2"
            onPress={() => {
              alert({ loading: true });
              setTimeout(() => {
                alert({ loading: false });
              }, 3000);
            }}
          />
          <Button
            title="Fancy Modal"
            className="my-2"
            onPress={() => {
              const fancyModal = getModal(Constants.FancyModal);
              fancyModal?.trigger();
            }}
          />
          <Button
            title="Custom Modal"
            className="my-2"
            onPress={() => {
              const customModal = getModal(Constants.CustomModal);
              customModal?.setForwardData({ content: 'Modal Title' });
              customModal?.trigger(true);
            }}
          />
          <Button
            title="Default Bottom Sheet"
            className="my-2"
            onPress={() => {
              const defaultBottomSheet = getBottomSheet(Constants.DefaultBottomSheet);
              defaultBottomSheet?.present();
            }}
          />
          <Button
            title="KeyboardHandling Bottom Sheet"
            className="my-2"
            onPress={() => {
              const keyboardHandlingBottomSheet = getBottomSheet(
                Constants.KeyboardHandlingBottomSheet,
              );
              keyboardHandlingBottomSheet?.present();
            }}
          />
          <Button
            title="Dynamic Bottom Sheet"
            className="my-2"
            onPress={() => {
              const dynamicBottomSheet = getBottomSheet(Constants.DynamicBottomSheet);
              dynamicBottomSheet?.present();
            }}
          />
          <Button
            title="Stack Bottom Sheet"
            className="my-2"
            onPress={() => {
              const stackBottomSheet = getBottomSheet(Constants.StackBottomSheet);
              stackBottomSheet?.present();
            }}
          />
        </View>
      </ScrollView>
      <Modal isVisible={isVisible} onBackdropPress={() => setIsVisible(false)}>
        <View className="bg-color-background rounded-[10px] p-[30px] w-[200px] self-center">
          <Text className="text-center">Hi 👋!</Text>
          <Button title="Close" className="mt-5" onPress={() => setIsVisible(false)} />
        </View>
      </Modal>
    </View>
  );
};

export default withBottomSheetProvider(ModalExample);
