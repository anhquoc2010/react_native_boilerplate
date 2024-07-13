import React, { useLayoutEffect } from 'react';
import { render, RenderAPI } from '@testing-library/react-native';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import store, { persistor, createStore } from '@configs/store';
import { LoadingScreen } from '@app';
import { NavigationContainer } from '@react-navigation/native';
import Navigation from './Navigation';
import MockAdapter from 'axios-mock-adapter';
import { Axios } from '@utils/Api';

import DefaultColor from '@themes/DefaultColor';
import { RootState, useAppDispatch, useAppSelector } from './Redux';
import _ from 'lodash';

import { renderHook } from '@testing-library/react-hooks';

type DeepPartial<T> = T extends object
  ? {
      [P in keyof T]?: DeepPartial<T[P]>;
    }
  : T;

/**
 * Login Handler
 */
export const successCredential = { email: 'admin@gmail.com', password: '123456' };
export const successLoginResponse = {
  data: {
    token:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwic3RhdHVzIjoiQUNUSVZFIiwicm9sZSI6IkFETUlOIiwicm9sZUlkIjoxLCJwZXJtaXNzaW9ucyI6WyJBTEwiXSwidGFibGUiOiJ1c2VycyIsImlkRm9yZWlnbktleSI6InVzZXJJZCIsImlhdCI6MTY1NTQ1NzU5OCwiZXhwIjoxNjYwNjQxNTk4fQ.ZA1dsxArHAjb60HzQgKbkinl49cf5OiDWASiE_Wr0SA',
    id: 1,
    email: 'admin@gmail.com',
    fullName: 'Admin',
    phone: '0327571918',
    avatar:
      'https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcRlUbAyS_643dq_B69jZAlPNW6_Xc7SLELY6SpRsc5OI2wHiiYG&usqp=CAU',
    role: {
      createdAt: '2021-04-19T05:58:23.094Z',
      updatedAt: '2021-04-19T05:58:23.094Z',
      deletedAt: null,
      id: 1,
      name: 'ADMIN',
      description: 'ADMIN',
      permissions: [
        {
          id: 1,
          name: 'ALL',
          description: null,
        },
      ],
    },
  },
};

export const failCredential = { email: 'client@gmail.com', password: '123456' };
export const failLoginResponse = {
  statusCode: 401,
  message: [
    {
      code: 'INCORRECT_EMAIL_PASSWORD',
      description: 'Incorrect email or password',
    },
  ],
  error: 'Unauthorized',
};

const auth = {
  loading: false,
  data: successLoginResponse.data,
  error: null,
};
const withAuthStore = createStore({ auth });

/**
 * Wrapper handler
 */

export type OtherRenderOptions = {
  preloadedState?: DeepPartial<RootState>;
  withAuth?: boolean;
  disableNavigationRef?: boolean;
};

const AppContainer = ({
  children,
  disableNavigationRef,
}: {
  children: any;
  disableNavigationRef?: boolean;
}) => {
  const [loginData] = useAppSelector(state => [state.auth.data]);

  const dispatch = useAppDispatch();

  useLayoutEffect(() => {
    const initApp = () => {
      if (loginData?.token) {
        global.app.token = loginData.token;
      }
      global.app.fn = {} as any;
      global.app.dispatch = dispatch;
    };
    initApp();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <NavigationContainer
      ref={disableNavigationRef ? null : Navigation.navigationRef}
      theme={DefaultColor}
    >
      {children}
    </NavigationContainer>
  );
};

const AppProviders = ({
  children,
  preloadedState,
  withAuth,
  disableNavigationRef,
}: {
  children: any;
} & OtherRenderOptions) => {
  const mergedPreloadedState: DeepPartial<RootState> = withAuth
    ? _.merge({ auth }, preloadedState as any)
    : preloadedState;

  return (
    // Create new store if preloadedState !== undefined
    <Provider
      store={preloadedState ? createStore(mergedPreloadedState) : withAuth ? withAuthStore : store}
    >
      <PersistGate loading={LoadingScreen()} persistor={persistor}>
        <AppContainer disableNavigationRef={disableNavigationRef}>{children}</AppContainer>
      </PersistGate>
    </Provider>
  );
};

const customRender = (
  component: React.ReactElement<any>,
  // options?: RenderOptions & OtherRenderOptions,
  options?: OtherRenderOptions,
): RenderAPI => {
  const CustomWrapper = options?.wrapper || React.Fragment;
  const Wrapper = options?.wrapper
    ? ({ children }: any) => (
        <AppProviders
          preloadedState={options?.preloadedState}
          withAuth={options?.withAuth}
          disableNavigationRef={options.disableNavigationRef}
        >
          <CustomWrapper>{children}</CustomWrapper>
        </AppProviders>
      )
    : ({ children }: any) => (
        <AppProviders
          preloadedState={options?.preloadedState}
          withAuth={options?.withAuth}
          disableNavigationRef={options?.disableNavigationRef}
        >
          {children}
        </AppProviders>
      );

  return render(component, { ...options, wrapper: Wrapper });
};

const customRenderHook: typeof renderHook = (callback, options) => {
  const disableNavigationRef =
    typeof options?.disableNavigationRef === 'undefined' ? true : options?.disableNavigationRef;
  const CustomWrapper: any = options?.wrapper || React.Fragment;
  const Wrapper = options?.wrapper
    ? ({ children }: any) => (
        <AppProviders
          preloadedState={options?.preloadedState}
          withAuth={options?.withAuth}
          disableNavigationRef={disableNavigationRef}
        >
          <CustomWrapper>{children}</CustomWrapper>
        </AppProviders>
      )
    : ({ children }: any) => (
        <AppProviders
          preloadedState={options?.preloadedState}
          withAuth={options?.withAuth}
          disableNavigationRef={disableNavigationRef}
        >
          {children}
        </AppProviders>
      );

  return renderHook(callback, { ...options, wrapper: Wrapper });
};

// re-export everything
export * from '@testing-library/react-native';

// override render method
export { customRender as render };

export { customRenderHook as renderHook };

const mockAxios = new MockAdapter(Axios, { delayResponse: 200 });

export { mockAxios };
