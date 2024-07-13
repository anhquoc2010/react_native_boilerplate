import React, { useEffect, useImperativeHandle, useRef, useState } from 'react';
import { useTheme } from '@react-navigation/native';
import { Icon, Modal, Text, TouchableOpacity, View } from '@components';
import { ModalProps, ModalType } from '../Modal';
import { FlatList } from 'react-native';
import { PickerProps } from '.';

export interface ModalPickerProps extends ModalProps {
  ref?: React.Ref<ModalType>;
  title?: string;
  showActionIcon?: boolean;
}

interface AdditionalPickerProps {
  setSelectedIndex: React.Dispatch<React.SetStateAction<number>>;
  setSelectedIndexes: React.Dispatch<React.SetStateAction<number[]>>;
}

const ModalPicker: React.FC<PickerProps & AdditionalPickerProps & ModalPickerProps> =
  React.forwardRef((props, ref: any) => {
    const modalRef = useRef<ModalType>(null);
    const {
      type,
      title,
      options,
      // @ts-ignore
      selectedIndex,
      setSelectedIndex,
      // @ts-ignore
      selectedIndexes,
      setSelectedIndexes,
      onConfirm,
      onCancel,
      showActionIcon,
      ...modalPickerProps
    } = props;

    const theme = useTheme();
    const [modalSelectedIndex, setModalSelectedIndex] = useState(selectedIndex);
    const [modalSelectedIndexes, setModalSelectedIndexes] = useState(selectedIndexes);

    useImperativeHandle(ref, () => ({
      ...modalRef.current,
    }));

    useEffect(() => {
      setModalSelectedIndex(selectedIndex);
    }, [selectedIndex]);

    useEffect(() => {
      setModalSelectedIndexes(selectedIndexes);
    }, [selectedIndexes]);

    const onPressIndex = (index: number) => {
      if (type === 'single') {
        if (showActionIcon) {
          setModalSelectedIndex(index);
        } else {
          setModalSelectedIndex(index);
          setSelectedIndex(index);
          onConfirm?.(index);
          modalRef.current?.trigger(false);
        }
      } else {
        if (modalSelectedIndexes) {
          const results = modalSelectedIndexes ? [...modalSelectedIndexes] : [];
          const itemIndex = results.indexOf(index);
          if (itemIndex > -1) {
            results.splice(itemIndex, 1);
          } else {
            results.push(index);
          }
          setModalSelectedIndexes(results);
        }
      }
    };

    const onPressCancel = () => {
      onCancel?.();
      modalRef.current?.trigger(false);
    };

    const onPressCheck = () => {
      if (type === 'single') {
        setSelectedIndex(modalSelectedIndex);
        onConfirm?.(modalSelectedIndex);
      } else {
        setSelectedIndexes(modalSelectedIndexes.sort());
        onConfirm?.(modalSelectedIndexes.sort());
      }
      modalRef.current?.trigger(false);
    };

    const renderItem = ({ item, index }: { item: string; index: number }) => (
      <TouchableOpacity className="flex-row items-center py-2" onPress={() => onPressIndex(index)}>
        <Icon
          name={
            type === 'multiple'
              ? 'checkbox-marked'
              : (`circle${modalSelectedIndex === index ? '-slice-8' : '-outline'}` as any)
          }
          color={
            modalSelectedIndexes?.includes(index) || type === 'single'
              ? theme.colors.text
              : '#EBEBEB'
          }
        />
        <Text className="ml-2 text-base">{item}</Text>
      </TouchableOpacity>
    );

    return (
      <Modal
        ref={modalRef}
        animationIn="fadeIn"
        animationOut="fadeOut"
        statusBarTranslucent
        onBackdropPress={onCancel}
        {...modalPickerProps}
      >
        <View className="bg-color-white p rounded">
          <View className="flex-row justify-between items-center mb-2">
            {showActionIcon || type === 'multiple' ? (
              <Icon name="close" onPress={onPressCancel} />
            ) : (
              <View />
            )}
            <Text className="font-bold text-lg mb-1 ml-0.5">{title || ''}</Text>
            {showActionIcon || type === 'multiple' ? (
              <Icon name="check" onPress={onPressCheck} />
            ) : (
              <View />
            )}
          </View>
          <FlatList data={options} renderItem={renderItem} />
        </View>
      </Modal>
    );
  });

export default ModalPicker;
