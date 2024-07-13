import React, { useImperativeHandle, useMemo, useRef } from 'react';
import { ImageRequireSource, ImageURISource, Modal, StatusBar } from 'react-native';
import ImageViewer, { ImageViewerPropsDefine } from 'react-native-image-zoom-viewer';
import Loading from '@components/Common/Loading';
import View from '@components/Common/View/View';
import Touchable from '@components/Common/Button/Touchable';
import Icon from '@components/Common/Icon';
import AppView from '@utils/AppView';
import Text from '@components/Common/Text';
import { FastImageProps } from 'react-native-fast-image';

interface ImageViewerModalProps extends Omit<ImageViewerPropsDefine, 'imageUrls'> {
  isModalVisible: boolean;
  setModalVisible: (isVisible: boolean) => void;
  source?: FastImageProps['source'];
  multipleSources?: Array<ImageURISource | ImageRequireSource>;
  imageDimensions: { width: number; height: number };
}

const ImageViewerModal: React.FC<ImageViewerModalProps> = React.forwardRef((props, ref: any) => {
  const imageViewerRef = useRef<ImageViewer>(null);

  const {
    isModalVisible,
    setModalVisible,
    source,
    multipleSources: multipleSourcesProp,
    imageDimensions,
    ...otherProps
  } = props;

  const multipleSources = useMemo(
    () => multipleSourcesProp || ([source] as any),
    [multipleSourcesProp, source],
  );

  const initialImageIndex = multipleSources.findIndex(
    (e: any) => JSON.stringify(e) === JSON.stringify(source),
  );

  const imageUrls = useMemo(() => {
    const result: any[] = [];
    const ratio = imageDimensions.height / imageDimensions.width;
    const dimensions = { width: AppView.screenWidth, height: ratio * AppView.screenWidth };
    multipleSources.forEach((e: any) => {
      /* istanbul ignore else */
      if (e) {
        if (e?.uri) {
          result.push({
            url: e.uri,
            props: {
              source: e,
              style: dimensions,
            },
            ...dimensions,
          });
        } else {
          result.push({
            url: '',
            props: {
              source: e,
              style: dimensions,
            },
            ...dimensions,
          });
        }
      }
    });

    return result;
  }, [multipleSources, imageDimensions]);

  const onRequestClose = () => {
    setModalVisible(false);
  };

  useImperativeHandle(ref, () => ({
    ...imageViewerRef.current,
  }));

  return (
    <Modal
      testID="ImageViewerModal"
      visible={isModalVisible}
      statusBarTranslucent
      transparent
      presentationStyle="overFullScreen"
      animationType="fade"
      hardwareAccelerated
    >
      <StatusBar barStyle="light-content" />
      <ImageViewer
        ref={imageViewerRef}
        onCancel={onRequestClose}
        loadingRender={() => <Loading size="large" />}
        enableSwipeDown
        index={initialImageIndex}
        enablePreload
        useNativeDriver
        renderHeader={() => (
          <View
            style={{
              position: 'absolute',
              top: AppView.safeAreaInsets.top + 8,
              right: 20,
              zIndex: 1,
            }}
          >
            <Touchable
              onPress={onRequestClose}
              style={{ padding: 8, borderRadius: 100, backgroundColor: 'rgba(0,0,0,0.4)' }}
            >
              <Icon name="close" type="antdesign" size={24} color="#FFFFFF" />
            </Touchable>
          </View>
        )}
        renderIndicator={(currentIndex?: number | undefined, allSize?: number | undefined) =>
          allSize && allSize > 1 ? (
            <View
              style={{
                position: 'absolute',
                bottom: 36,
                alignSelf: 'center',
                zIndex: 1,
                borderRadius: 8,
                paddingVertical: 5,
                paddingHorizontal: 10,
                backgroundColor: 'rgba(0,0,0,0.4)',
              }}
            >
              <Text style={{ color: 'white', fontSize: 16 }}>{`${currentIndex} / ${allSize}`}</Text>
            </View>
          ) : (
            <View />
          )
        }
        {...otherProps}
        imageUrls={imageUrls}
      />
    </Modal>
  );
});

export default ImageViewerModal as React.FC<
  ImageViewerModalProps & { ref?: React.RefObject<ImageViewer> }
>;
