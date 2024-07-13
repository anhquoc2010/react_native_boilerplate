import AppView from '@utils/AppView';
import Helper from '@utils/Helper';
import React, { useRef, useState } from 'react';
import Modal, { ModalProps, ModalType } from './index';

interface IModalContext {
  setModal: (key: Exclude<string, 'alert'>, modalProps: ModalProps) => void;
  getModal: (key: Exclude<string, 'alert'>) => React.MutableRefObject<ModalType | null>['current'];
  alert: (props: ModalProps['alert']) => void;
}
export const ModalContext = React.createContext({} as IModalContext);

const ModalProvider: React.FC<{ children: React.ReactNode }> = props => {
  const alertRef = useRef<ModalType>(null);
  const modalRefs = useRef([] as any);

  const { children } = props;

  const [alertProps, setAlertProps] = useState<ModalProps['alert']>({});
  const [modals, setModals] = useState<JSX.Element[]>([]);

  const setModal = (key: string, modalProps: ModalProps) => {
    setModals(oldModals => {
      const newModals = [...oldModals];
      let hasReplace = false;
      modals.forEach((e, i) => {
        if (e.key === key) {
          hasReplace = true;
          if (!Helper.shallowEqual(modals[i].props, modalProps)) {
            const nodeWithNewProps = React.cloneElement(modals[i], modalProps);
            newModals[i] = nodeWithNewProps;
          }
        }
      });

      if (!hasReplace) {
        const newModal = (
          <Modal ref={ref => (modalRefs.current[key] = ref)} key={key} {...modalProps} />
        );
        newModals.push(newModal);
      }
      return newModals;
    });
  };

  const getModal = (key: string) => {
    if (key === 'alert') {
      return alertRef.current;
    } else {
      return modalRefs.current[key];
    }
  };

  const alert = (newAlertProps: ModalProps['alert']) => {
    setAlertProps(newAlertProps);
    if (newAlertProps?.loading === false) {
      alertRef.current?.trigger(false);
    } else {
      alertRef.current?.trigger(true);
    }
  };

  return (
    <ModalContext.Provider
      value={{
        setModal,
        getModal,
        alert,
      }}
    >
      {children}
      {modals}
      <Modal
        testID="ModalProvider"
        ref={alertRef}
        alert={alertProps}
        statusBarTranslucent
        deviceHeight={
          AppView.windowHeight + AppView.safeAreaInsets.top + AppView.safeAreaInsets.bottom
        }
      />
    </ModalContext.Provider>
  );
};

export default ModalProvider;

export const ModalConsumer = ModalContext.Consumer;
