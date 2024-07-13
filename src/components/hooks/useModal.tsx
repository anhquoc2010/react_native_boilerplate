import { useContext } from 'react';
import { ModalContext } from '@components/Common/Modal/ModalProvider';

const useModal = () => useContext(ModalContext);

export default useModal;
