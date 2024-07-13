import React from 'react';
import ModalScreens from '@screens/Modal';
import AppHelper from '@utils/AppHelper';

export default function ModalStack() {
  return (
    <>
      {AppHelper.createScreenList(ModalScreens, {
        DefaultModal: {
          options: { presentation: 'modal' },
        },
      })}
      {/* {(Object.keys(ModalScreens) as any).map((key: keyof typeof ModalScreens) => (
        <Stack.Screen
          key={key}
          name={key}
          component={ModalScreens[key]}
          options={{ presentation: 'modal' }}
        />
      ))} */}
    </>
  );
}
