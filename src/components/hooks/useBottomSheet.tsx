import { useContext } from 'react';
import { BottomSheetContext } from '@components/Common/BottomSheet/BottomSheetProvider';

const useBottomSheet = () => useContext(BottomSheetContext);

export default useBottomSheet;
