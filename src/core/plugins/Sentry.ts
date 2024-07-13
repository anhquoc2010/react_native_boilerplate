import * as sentry from '@sentry/react-native';
import Config from 'react-native-config';

class CSentry {
  private static _instance: CSentry;

  private constructor() {
    if (!__DEV__) {
      this.init();
    }
  }

  public static get Instance(): CSentry {
    /* istanbul ignore else */
    if (!this._instance) {
      this._instance = new this();
    }
    return CSentry._instance;
  }

  reactNavigationInstrumentation = new sentry.ReactNavigationInstrumentation();

  init = () =>
    sentry.init({
      dsn: Config.SENTRY_DNS,
      tracesSampleRate: 1.0,
      environment: Config.NODE_ENV,
      integrations: [
        new sentry.ReactNativeTracing({
          routingInstrumentation: this.reactNavigationInstrumentation,
          tracingOrigins: ['localhost', /^\//, /^https:\/\//],
        }),
      ],
      enableAutoSessionTracking: true,
      attachStacktrace: true,
      normalizeDepth: 10,
    });

  setUser = (data?: any) => {
    if (data && data.id) {
      const identity = {
        id: data.id,
        name: data.fullName,
        email: data.email,
        phone: data.phone,
        avatar: data.avatar,
      };
      sentry.setUser(identity);
    } else {
      sentry.setUser(null);
    }
  };

  flush = sentry.flush;

  wrap = sentry.wrap;

  createReduxEnhancer = sentry.createReduxEnhancer;
}

const Sentry = CSentry.Instance;
export default Sentry;
