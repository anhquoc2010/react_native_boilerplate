import analytics, { FirebaseAnalyticsTypes } from '@react-native-firebase/analytics';
import _ from 'lodash';

export type TLogEvent = 'product_list_view' | 'product_detail_view' | 'login' | 'logout';

class CLog {
  private static _instance: CLog;

  private constructor() {
    // ...
  }

  public static get Instance(): CLog {
    /* istanbul ignore else */
    if (!this._instance) {
      this._instance = new this();
    }
    return CLog._instance;
  }

  log = async (
    eventName: TLogEvent,
    params?: {
      [key: string]: any;
    },
  ) => {
    if (params && !_.isEmpty(params)) {
      // eslint-disable-next-line no-console
      console.log('[LOG]', eventName, ':', params);

      await analytics().logEvent(eventName, params);
    } else {
      // eslint-disable-next-line no-console
      console.log('[LOG]', eventName);

      await analytics().logEvent(eventName);
    }
  };

  logLogin = async (params: FirebaseAnalyticsTypes.LoginEventParameters) =>
    analytics().logLogin(params);

  logScreenView = async (params: FirebaseAnalyticsTypes.ScreenViewParameters) =>
    analytics().logScreenView(params);

  logSearch = async (params: FirebaseAnalyticsTypes.SearchEventParameters) =>
    analytics().logSearch(params);

  logSelectContent = async (params: FirebaseAnalyticsTypes.SelectContentEventParameters) =>
    analytics().logSelectContent(params);

  logSelectItem = async (params: FirebaseAnalyticsTypes.SelectItemEventParameters) =>
    analytics().logSelectItem(params);

  logShare = async (params: FirebaseAnalyticsTypes.ShareEventParameters) =>
    analytics().logShare(params);

  logSignUp = async (params: FirebaseAnalyticsTypes.SignUpEventParameters) =>
    analytics().logSignUp(params);
}

const Log = CLog.Instance;
export default Log;
