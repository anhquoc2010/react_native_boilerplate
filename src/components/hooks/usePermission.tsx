import Helper from '@utils/Helper';
import { useTranslation } from 'react-i18next';
import { Alert, Platform } from 'react-native';
import RNPermissions, { Permission, PERMISSIONS } from 'react-native-permissions';
import useModal from './useModal';

export type TResultUsePermission = {
  requestPermission: (
    permissionItem: PermissionItem,
    onAuthorized?: Function,
    onDenied?: Function,
  ) => Promise<boolean>;
};

export interface PermissionItem {
  ios?: keyof typeof PERMISSIONS.IOS;
  android?: keyof typeof PERMISSIONS.ANDROID;
  deniedMessage?: string;
}

type TUsePermission = (props?: { alertType?: 'modal' | 'alert' }) => TResultUsePermission;

const usePermission: TUsePermission = props => {
  const { t } = useTranslation();
  const { alert, getModal } = useModal();

  const showUnauthorizedModal = (
    permissionItem: PermissionItem,
    type: 'denied' | 'blocked',
    onAuthorized?: Function,
    onDenied?: Function,
  ) => {
    if (props?.alertType === 'alert') {
      Alert.alert(
        t('permissionDenied.title'),
        permissionItem.deniedMessage || t('permissionDenied.general'),
        [
          {
            text: t('common.cancel'),
            onPress: () => {
              onDenied?.();
            },
            style: 'cancel',
          },
          {
            text: type === 'blocked' ? t('permissionDenied.goToSettings') : t('common.ok'),
            onPress: async () => {
              await Helper.sleep(100);
              switch (type) {
                case 'blocked':
                  RNPermissions.openSettings();
                  break;
                case 'denied':
                  requestPermission(permissionItem);
                  break;
                default:
                  await onAuthorized?.();
              }
            },
          },
        ],
      );
    } else {
      alert({
        title: t('permissionDenied.title'),
        description: permissionItem.deniedMessage || t('permissionDenied.general'),
        okTitle: type === 'blocked' ? t('permissionDenied.goToSettings') : t('common.ok'),
        showCancel: true,
        onOkButtonPress: async () => {
          const currentModal = getModal('alert');
          currentModal?.close();
          await Helper.sleep(100);
          switch (type) {
            case 'blocked':
              RNPermissions.openSettings();
              break;
            case 'denied':
              requestPermission(permissionItem);
              break;
            default:
              await onAuthorized?.();
          }
        },
        onCancelButtonPress: onDenied,
      });
    }
  };

  const requestPermission = async (
    permissionItem: PermissionItem,
    onAuthorized?: Function,
    onDenied?: Function,
  ) => {
    const permission = permissionItem[Platform.OS as 'ios' | 'android']
      ? (PERMISSIONS[Platform.OS.toUpperCase() as 'ANDROID' | 'IOS'][
          // @ts-ignore
          permissionItem[Platform.OS as 'ios' | 'android']
        ] as Permission)
      : undefined;

    if (permission) {
      const status = await RNPermissions.check(permission);
      switch (status) {
        case 'denied':
          try {
            const request = await RNPermissions.request(permission);
            if (request === 'blocked') {
              showUnauthorizedModal(permissionItem, request, onAuthorized, onDenied);
              return false;
            }
            if (request === 'denied') {
              if (Platform.OS === 'android') {
                showUnauthorizedModal(permissionItem, request, onAuthorized, onDenied);
              }
              return false;
            }
            if (request === 'granted' || request === 'limited') {
              await onAuthorized?.();
              return true;
            }
            return false;
          } catch (error) {
            return false;
          }
        case 'blocked':
          showUnauthorizedModal(permissionItem, 'blocked', onAuthorized, onDenied);
          return false;
        case 'granted':
        case 'limited':
          await onAuthorized?.();
          return true;
        default:
          return false;
      }
    } else {
      await onAuthorized?.();
      return true;
    }
  };

  return { requestPermission };
};

export default usePermission;
