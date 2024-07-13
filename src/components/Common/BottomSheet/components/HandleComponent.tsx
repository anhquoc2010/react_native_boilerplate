import React, { memo } from 'react';
import { BottomSheetHandle, BottomSheetHandleProps } from '@gorhom/bottom-sheet';
import Text from '@components/Common/Text';
import { useTheme } from '@react-navigation/native';
import View from '@components/Common/View/View';
import Icon from '@components/Common/Icon';
import TouchableOpacity from '@components/Common/Button/TouchableOpacity';
import AppView from '@utils/AppView';

export interface HandleComponentProps extends BottomSheetHandleProps {
  onClose?: () => void;
  children?: string | React.ReactNode | React.ReactNode[];
}

const HandleComponent = (props: HandleComponentProps) => {
  const { onClose, children, ...otherProps } = props;
  const theme = useTheme();

  const renderChildren = () => {
    if (typeof children === 'string' || onClose) {
      return (
        <View
          className="flex-row justify-between items-center mt-3"
          style={{ paddingHorizontal: AppView.bodyPaddingHorizontal }}
        >
          <View />
          <Text
            style={{
              fontSize: 20,
              textAlign: 'center',
              fontWeight: 'bold',
            }}
          >
            {typeof children === 'string' ? children : ''}
          </Text>
          {onClose ? (
            <TouchableOpacity onPress={onClose}>
              <Icon type="antdesign" name="close" />
            </TouchableOpacity>
          ) : (
            <View />
          )}
        </View>
      );
    }
    return children;
  };

  return (
    <BottomSheetHandle
      {...otherProps}
      // style={{
      //   paddingBottom: 12,
      //   paddingHorizontal: 16,
      //   borderBottomWidth: 0.5,
      //   borderBottomColor: Color(theme.colors.grey3).hex(),
      //   zIndex: 99999,
      // }}
      indicatorStyle={{
        height: 4,
        opacity: 0.5,
        backgroundColor: theme.colors.black,
      }}
    >
      {renderChildren()}
    </BottomSheetHandle>
  );
};

export default memo(HandleComponent);
