import {
  StyleProp,
  Image as RNImage,
  Animated,
  TouchableOpacity,
  ImageURISource,
  ImageRequireSource,
  ViewStyle,
  StyleSheet,
  View,
} from 'react-native';
import React, { useEffect, useImperativeHandle, useRef, useState } from 'react';
import withTailwind from '@components/hoc/withTailwind';
import ImageSource from '@images';
import { useTheme } from '@react-navigation/native';
import Loading from '../Loading';
import _ from 'lodash';
import AppView from '@utils/AppView';
import ImageViewerModal from './components/ImageViewerModal';
import ImageViewer from 'react-native-image-zoom-viewer';
import FastImage, { FastImageProps, ImageStyle, OnLoadEvent } from 'react-native-fast-image';

export interface ImageProps extends FastImageProps {
  className?: string;
  autoHeight?: boolean;
  autoWidth?: boolean;
  viewEnable?: boolean;
  multipleSources?: Array<ImageURISource | ImageRequireSource>;
  disablePlaceholder?: boolean;
  sharp?: boolean;
  width?: number | string;
  height?: number | string;
  maxWidth?: number;
  maxHeight?: number;
}

const containerStyleKeys = [
  'alignSelf',
  'margin',
  'marginLeft',
  'marginRight',
  'marginTop',
  'marginBottom',
  'marginVertical',
  'marginHorizontal',
  'position',
  'borderColor',
  'borderTopColor',
  'borderBottomColor',
  'borderLeftColor',
  'borderRightColor',
];

const Image: React.FC<ImageProps> = React.forwardRef((props, ref: any) => {
  const imageViewerModalRef = useRef<ImageViewer>(null);

  const theme = useTheme();

  const {
    style: rawStyleProp,
    width: widthProp,
    height: heightProp,
    maxWidth,
    maxHeight,
    autoHeight,
    autoWidth,
    viewEnable,
    multipleSources,
    source,
    disablePlaceholder,
    sharp,
    ...otherProps
  } = props;
  const styleProp: StyleProp<ImageStyle> = StyleSheet.flatten(rawStyleProp);

  // @ts-ignore
  const isLocalImage = !source?.uri;

  const [isModalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(!isLocalImage);

  const localDimensions: any = isLocalImage ? RNImage.resolveAssetSource(source as any) : null;

  const [width, setWidth] = useState(
    widthProp || (styleProp?.width as number | undefined) || AppView.bodyWidth,
  );
  const [height, setHeight] = useState(
    heightProp ||
      (typeof width === 'number'
        ? (styleProp?.height as number | undefined) ||
          (localDimensions
            ? (localDimensions.height / localDimensions.width) * width
            : AppView.bodyWidth)
        : undefined),
  );

  useEffect(() => {
    if (maxWidth && typeof width === 'number' && width > maxWidth) {
      setWidth(maxWidth);
    }
    if (maxHeight && typeof height === 'number' && height > maxHeight) {
      setHeight(maxHeight);
    }
  }, [maxWidth, maxHeight, width, height]);

  const [imageDimensions, setImageDimensions] = useState({ width, height } as {
    width: number;
    height: number;
  });

  const fadeInAnim = useRef(new Animated.Value(0)).current;
  const fadeOutAnim = useRef(new Animated.Value(1)).current;

  const onLoad = (e: OnLoadEvent) => {
    const {
      nativeEvent: { height: imageHeight, width: imageWidth },
    } = e;

    const ratio = imageHeight / imageWidth;

    if (
      !autoWidth &&
      autoHeight &&
      !heightProp &&
      !styleProp?.height &&
      typeof width === 'number'
    ) {
      if (height !== ratio * width) {
        setHeight(ratio * width);
      }
    }
    if (autoWidth && !widthProp && !styleProp.width && typeof height === 'number') {
      if (width !== height / ratio) {
        setWidth(height / ratio);
      }
    }
    setImageDimensions({ width: imageWidth, height: imageHeight });
    setLoading(false);

    Animated.timing(fadeInAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
    Animated.timing(fadeOutAnim, {
      toValue: 0,
      duration: 250,
      useNativeDriver: true,
    }).start();
    props.onLoad?.(e);
  };

  const style: StyleProp<ImageStyle> = StyleSheet.flatten([
    {
      width,
      height,
      borderRadius: sharp ? 0 : AppView.roundedBorderRadius,
    },
    styleProp,
  ]);
  const containerStyle: StyleProp<ViewStyle> = {
    ...(_.pick(style, containerStyleKeys) as any),
    width,
    height,
    borderRadius: (style as any).borderRadius,
  };
  const imageStyle: StyleProp<ImageStyle> = _.omit(style, containerStyleKeys) as any;

  const onViewImage = () => {
    setModalVisible(true);
  };

  const renderPlaceholder = () => {
    if (!disablePlaceholder && loading) {
      return (
        <Animated.View style={{ position: 'absolute', opacity: fadeOutAnim }}>
          <FastImage
            testID="PlaceholderImage"
            source={ImageSource.placeholderImage}
            style={[
              imageStyle,
              {
                tintColor: theme.dark ? theme.colors.grey1 : theme.colors.grey3,
              },
            ]}
            resizeMode="contain"
          />
        </Animated.View>
      );
    }
    if (loading) {
      return (
        <Loading
          testID="Loading"
          style={{ position: 'absolute', alignSelf: 'center', height: '100%' }}
        />
      );
    }
    return null;
  };

  const renderImage = (customProps?: any) => {
    const isFullScreen = !!customProps;
    const ratio =
      typeof width === 'number' && typeof height === 'number'
        ? (height * 1.0) / width
        : typeof width === 'string' && typeof height === 'string'
        ? Number.parseFloat(height) / Number.parseFloat(width)
        : 1;

    const viewModeHeight = customProps?.style?.height || ratio * AppView.screenWidth;
    const imgSource = customProps?.source || source;
    const imgStyle: any = StyleSheet.flatten([
      imageStyle,
      {
        width: isModalVisible ? AppView.screenWidth : width,
        height: isModalVisible ? viewModeHeight : height,
        borderRadius: isModalVisible ? 0 : style.borderRadius,
        borderTopLeftRadius: isModalVisible ? 0 : style.borderTopLeftRadius,
        borderTopRightRadius: isModalVisible ? 0 : style.borderTopRightRadius,
        borderBottomLeftRadius: isModalVisible ? 0 : style.borderBottomLeftRadius,
        borderBottomRightRadius: isModalVisible ? 0 : style.borderBottomRightRadius,
      },
    ]);

    return (
      <Animated.View style={{ opacity: isModalVisible || isLocalImage ? 1 : fadeInAnim }}>
        <FastImage
          testID={`Image${isFullScreen ? 'FullScreen' : ''}`}
          {...otherProps}
          key={isModalVisible.toString()}
          style={imgStyle}
          onLoad={onLoad}
          source={imgSource}
        />
      </Animated.View>
    );
  };

  useImperativeHandle(ref, () => ({
    imageViewerModalRef,
  }));

  return (
    <View>
      <TouchableOpacity
        testID="ContainerTouchableOpacity"
        disabled={!viewEnable || !source}
        onPress={viewEnable ? onViewImage : undefined}
        style={containerStyle}
      >
        {renderImage()}
        {renderPlaceholder()}
      </TouchableOpacity>
      <ImageViewerModal
        ref={imageViewerModalRef}
        isModalVisible={isModalVisible}
        setModalVisible={setModalVisible}
        source={source}
        multipleSources={multipleSources}
        imageDimensions={imageDimensions}
        renderImage={renderImage}
      />
    </View>
  );
});

Image.defaultProps = {
  autoHeight: true,
};

export interface ImageType extends RNImage {
  imageViewerModalRef: React.RefObject<ImageViewer>;
}

export default withTailwind(Image) as React.FC<ImageProps & { ref?: React.LegacyRef<RNImage> }>;
