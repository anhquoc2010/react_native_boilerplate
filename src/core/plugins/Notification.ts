import messaging, { FirebaseMessagingTypes } from '@react-native-firebase/messaging';

type NotificationListenerFunction = (
  message: FirebaseMessagingTypes.RemoteMessage,
  isBackground: boolean,
) => any;

class CNotification {
  private static _instance: CNotification;

  private constructor() {
    // ...
  }

  notificationListener: {
    [key: string]: NotificationListenerFunction;
  } = {};
  messageSubscribe: any;

  public static get Instance(): CNotification {
    if (!this._instance) {
      this._instance = new this();
    }
    return CNotification._instance;
  }

  requestUserPermission = async () => {
    const hasPermission = await messaging().hasPermission();

    const authorizedStatus = [
      messaging.AuthorizationStatus.AUTHORIZED,
      messaging.AuthorizationStatus.PROVISIONAL,
    ];

    if (authorizedStatus.includes(hasPermission)) return true;

    const authStatus = await messaging().requestPermission();

    const enabled = authorizedStatus.includes(authStatus);

    return enabled;
  };

  getToken = () => messaging().getToken();

  registerMessageListener = (
    key: string,
    listener: NotificationListenerFunction,
    override = false,
  ) => {
    if (!this.notificationListener.hasOwnProperty(key) || override) {
      this.notificationListener[key] = listener;
    }
  };

  notificationHandler = async (
    message: FirebaseMessagingTypes.RemoteMessage,
    isBackground = false,
  ): Promise<any> => {
    for (const property in this.notificationListener) {
      if (this.notificationListener.hasOwnProperty(property)) {
        await this.notificationListener[property](message, isBackground);
      }
    }
  };

  triggerMessageListener = async () => {
    // Foreground
    this.messageSubscribe = messaging().onMessage(this.notificationHandler);

    // Background & Quit
    messaging().onNotificationOpenedApp(message => this.notificationHandler(message, true));
    messaging()
      .getInitialNotification()
      .then(message => message && this.notificationHandler(message, true));
    messaging().setBackgroundMessageHandler(message => this.notificationHandler(message, true));

    return this.messageSubscribe;
  };

  registerDeviceForRemoteMessages = () => messaging().registerDeviceForRemoteMessages();

  unregisterDeviceForRemoteMessages = () => messaging().unregisterDeviceForRemoteMessages();
}

const Notification = CNotification.Instance;
export default Notification;
