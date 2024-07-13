/// <reference types="nativewind/types" />

// declare var global: App.Global;

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      // Define custom environment variables
    }
  }
  var app: App.Global;
}

export {};

declare module '*.svg' {
  import React from 'react';
  import { SvgProps } from 'react-native-svg';

  const content: React.FC<SvgProps>;
  export default content;
}

declare module 'react-native-config' {
  interface Env {
    NODE_ENV: 'development' | 'staging' | 'production';
    API_URL: string;
    EMAIL: string;
    PASSWORD: string;
    GOOGLE_MAPS_API_KEY: string;
    LOG_ROCKET_API_KEY: string;
    SENTRY_DNS: string;
  }

  const Config: Env;
  export default Config;
}

// Override the theme in react native navigation to accept our custom theme props.
declare module '@react-navigation/native' {
  export const Link: typeof import('@react-navigation/native/lib/typescript/src/Link').default;
  export const NavigationContainer: typeof import('@react-navigation/native/lib/typescript/src/NavigationContainer').default;
  export const ServerContainer: typeof import('@react-navigation/native/lib/typescript/src/ServerContainer').default;
  export const ThemeProvider: typeof import('@react-navigation/native/lib/typescript/src/theming/ThemeProvider').default;
  export function useTheme(): App.Theme;
  export * from '@react-navigation/native/lib/typescript/src/types';
  export const useLinkBuilder: typeof import('@react-navigation/native/lib/typescript/src/useLinkBuilder').default;
  export const useLinkProps: typeof import('@react-navigation/native/lib/typescript/src/useLinkProps').default;
  export const useLinkTo: typeof import('@react-navigation/native/lib/typescript/src/useLinkTo').default;
  export const useScrollToTop: typeof import('@react-navigation/native/lib/typescript/src/useScrollToTop').default;
  export * from '@react-navigation/core';
}

declare module '@testing-library/react-hooks' {
  declare const renderHook: <TProps, TResult>(
    callback: (props: TProps) => TResult,
    options?: import('@testing-library/react-hooks').RenderHookOptions<TProps> &
      import('@testing-library/react-hooks').RendererOptions<TProps> &
      import('@utils/TestHelper').OtherRenderOptions,
  ) => {
    waitFor: import('@testing-library/react-hooks').WaitFor;
    waitForValueToChange: import('@testing-library/react-hooks').WaitForValueToChange;
    waitForNextUpdate: import('@testing-library/react-hooks').WaitForNextUpdate;
    result: import('@testing-library/react-hooks').RenderResult<TResult>;
    rerender: (newProps?: TProps | undefined) => void;
    unmount: () => void;
  } & Omit<
    {
      render(props?: TProps | undefined): void;
      rerender(props?: TProps | undefined): void;
      unmount(): void;
      act: typeof act;
    },
    'render' | 'act' | 'rerender' | 'unmount'
  >;
}
