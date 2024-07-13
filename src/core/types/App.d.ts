declare namespace App {
  export type Theme = typeof import('@core/themes/DefaultColor');

  export type ColorScheme = 'light' | 'dark';

  export type Language = 'en' | 'vi';

  export type DeviceInfo = {
    uniqueId: string;
    deviceName: string;
    systemName: string;
    systemVersion: string;
    isTablet: boolean;
    brand: string;
    model: string;
    buildNumber: number;
    buildVersion: string;
    manufacturer: string;
  };

  export type Global = {
    dispatch: import('@reduxjs/toolkit').ThunkDispatch<
      any,
      null,
      import('@reduxjs/toolkit').AnyAction
    > &
      import('@reduxjs/toolkit').ThunkDispatch<
        any,
        undefined,
        import('@reduxjs/toolkit').AnyAction
      > &
      import('@reduxjs/toolkit').Dispatch<any>;
    deviceInfo: DeviceInfo;
    token: string;
    fn: {
      setIsTabBarHidden?: (isHidden: boolean) => void;
    };
    theme: {
      colorScheme: ColorScheme;
      toggleColorScheme: () => void;
    };
  };
}
