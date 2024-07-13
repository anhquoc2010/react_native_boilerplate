import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import Helper from '@utils/Helper';
import React, { useRef, useState } from 'react';
import BottomSheet, { BottomSheetProps, BottomSheetType } from './index';

interface IBottomSheetContext {
  setBottomSheet: (key: string, bottomSheetProps: BottomSheetProps) => void;
  getBottomSheet: (key: string) => React.MutableRefObject<BottomSheetType | null>['current'];
}
export const BottomSheetContext = React.createContext({} as IBottomSheetContext);

const BottomSheetProvider: React.FC<{ children: any }> = props => {
  const { children } = props;
  const [bottomSheets, setBottomSheets] = useState<JSX.Element[]>([]);
  const bottomSheetRefs = useRef([] as any);

  const setBottomSheet = (key: string, bottomSheetProps: BottomSheetProps) => {
    setBottomSheets(oldBottomSheets => {
      const newBottomSheets = [...oldBottomSheets];

      let hasReplace = false;
      bottomSheets.forEach((e, i) => {
        if (e.key === key) {
          hasReplace = true;
          if (!Helper.shallowEqual(bottomSheets[i].props, bottomSheetProps)) {
            const nodeWithNewProps = React.cloneElement(bottomSheets[i], bottomSheetProps);
            newBottomSheets[i] = nodeWithNewProps;
          }
        }
      });

      if (!hasReplace) {
        const newBottomSheet = (
          <BottomSheet
            ref={ref => (bottomSheetRefs.current[key] = ref)}
            key={key}
            {...bottomSheetProps}
          />
        );
        newBottomSheets.push(newBottomSheet);
      }
      return newBottomSheets;
    });
  };

  const getBottomSheet = (key: string) => bottomSheetRefs.current[key];

  return (
    <BottomSheetContext.Provider
      value={{
        setBottomSheet,
        getBottomSheet,
      }}
    >
      <BottomSheetModalProvider>
        {children}
        {bottomSheets}
      </BottomSheetModalProvider>
    </BottomSheetContext.Provider>
  );
};

export default BottomSheetProvider;

export const BottomSheetConsumer = BottomSheetContext.Consumer;
