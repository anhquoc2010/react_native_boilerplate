import React from 'react';
import DeviceInfo from 'react-native-device-info';
import { showMessage } from 'react-native-flash-message';
import { FirebaseMessagingTypes } from '@react-native-firebase/messaging';
import { TError } from './Api';
import i18next from 'i18next';
import { FieldErrorsImpl, UseFormSetFocus } from 'react-hook-form';
import AppView from './AppView';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

export type TObject = {
  loading: boolean;
  data: any;
  error: null | TError;
};

export type TArray = {
  loading: boolean;
  data: any;
  metadata: any;
  error: null | TError;
  filter: any;
};

export interface IImage {
  name: string;
  mime: string;
  width: number;
  height: number;
  size: number;
  path: string;
  sourceUrl?: string;
  remoteUrl?: string;
  resizedImageUrl?: {
    origin: string;
    medium: string;
    thumbnail: string;
  };
}

export interface IResizedImage {
  origin: IImage;
  medium: IImage;
  thumbnail: IImage;
}

export interface IFile {
  name: string;
  mime: string;
  size?: string;
  path?: string;
  sourceUrl?: string;
  remoteUrl?: string;
  updatedAt?: Date;
}

const Stack = createNativeStackNavigator();

class CAppHelper {
  private static _instance: CAppHelper;

  private constructor() {
    // ...
  }

  public static get Instance(): CAppHelper {
    /* istanbul ignore else */
    if (!this._instance) {
      this._instance = new this();
    }
    return CAppHelper._instance;
  }

  isConnected = true;

  getParams = (props: any) => {
    const { route } = props;
    return route?.params;
  };

  getDataFromParams = (props: any) => {
    const { route } = props;
    return route?.params?.data;
  };

  setDataIntoParams = (data: any) => ({ data });

  /**
   * showMessage
   */
  showIsConnectionMessage = (isConnected = true) => {
    showMessage({
      message: isConnected
        ? i18next.t('common.connectionRestored')
        : i18next.t('common.connectionLost'),
      description: isConnected
        ? i18next.t('common.connectionRestoredDesc')
        : i18next.t('common.connectionLostDesc'),
      type: isConnected ? 'success' : 'danger',
      titleStyle: {
        fontWeight: 'bold',
        fontSize: 15,
      },
      style: {
        paddingTop:
          AppView.safeAreaInsets.top > 40
            ? AppView.safeAreaInsets.top - 20
            : AppView.safeAreaInsets.top,
      },
      duration: 5000,
    });
  };

  showNotificationMessage = (
    remoteMessage: FirebaseMessagingTypes.RemoteMessage,
    onPress?: () => any,
  ) => {
    if (remoteMessage.notification) {
      showMessage({
        message: remoteMessage.notification.title || '',
        description: remoteMessage.notification.body,
        backgroundColor: '#315DF7',
        icon: 'info',
        duration: 5000,
        hideStatusBar: false,
        titleStyle: {
          fontWeight: 'bold',
          fontSize: 15,
        },
        style: {
          paddingTop:
            AppView.safeAreaInsets.top > 40
              ? AppView.safeAreaInsets.top - 20
              : AppView.safeAreaInsets.top,
        },
        onPress: onPress || undefined,
      });
    }
  };

  setGlobalDeviceInfo = async () => {
    const deviceJSON: App.DeviceInfo = {
      uniqueId: await DeviceInfo.getUniqueId(),
      deviceName: await DeviceInfo.getDeviceName(),
      systemName: DeviceInfo.getSystemName(),
      systemVersion: DeviceInfo.getSystemVersion(),
      isTablet: DeviceInfo.isTablet(),
      brand: DeviceInfo.getBrand(),
      model: DeviceInfo.getModel(),
      buildNumber: parseInt(DeviceInfo.getBuildNumber(), 10),
      buildVersion: DeviceInfo.getVersion(),
      manufacturer: await DeviceInfo.getManufacturer(),
    };

    global.app.deviceInfo = deviceJSON;
  };

  // ===>
  // shouldComponentUpdate(props: any, state: any) {
  //   return AppHelper.compareProps(this.constructor.name, this.props, props);
  // }
  compareProps = (name: any, old: any, v: any) => {
    const keys = Object.keys(v);
    let shouldUpdate = false;
    for (let i = 0; i < keys.length; i += 1) {
      if (v[keys[i]] !== old[keys[i]]) {
        // eslint-disable-next-line no-console
        console.log(
          '%c %s: %s has changed from %o to %o',
          'color: #c00',
          name,
          keys[i],
          old[keys[i]],
          v[keys[i]],
        );
        shouldUpdate = true;
      }
    }
    return shouldUpdate;
  };

  getComponentDisplayName(WrappedComponent: any) {
    return WrappedComponent.displayName || WrappedComponent.name || 'Component';
  }

  focusInvalidField = (err: FieldErrorsImpl<any>, setFocus: UseFormSetFocus<any>) => {
    const errFields = Object.keys(err);

    if (errFields?.length > 0) {
      setFocus(errFields[0]);
    }
  };

  createScreenList = <ScreenList,>(
    screens: ScreenList,
    params?: Partial<{ [K in keyof ScreenList]: Partial<Parameters<typeof Stack.Screen>[0]> }>,
    // params: Partial<Record<keyof ScreenList, Partial<Parameters<typeof Stack.Screen>[0]>>>,
  ) =>
    Object.keys(screens as any).map(key => (
      <Stack.Screen
        key={key as any}
        name={key as any}
        component={(screens as any)[key]}
        {...((params as any)?.[key] || {})}
      />
    ));
}

const AppHelper = CAppHelper.Instance;
export default AppHelper;
