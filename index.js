/**
 * @format
 */

import 'react-native-gesture-handler';
import {AppRegistry, LogBox} from 'react-native';
import App from './src/app';
import {name as appName} from './app.json';
import 'moment/locale/vi';
import './src/core/themes/SafeList';
import * as Sentry from '@sentry/react-native';

LogBox.ignoreLogs([
  'Sending `onReanimatedPropsChange` with no listeners registered.',
  'Selector unknown returned a different result when called with the same parameters. This can lead to unnecessary rerenders'
]);

Sentry.init({
  dsn: "https://069a3aee071c03188631bb05ca388398@o4505361260150784.ingest.us.sentry.io/4506972811231232",
  // Set tracesSampleRate to 1.0 to capture 100% of transactions for performance monitoring.
  // We recommend adjusting this value in production.
  tracesSampleRate: 1.0,
});

AppRegistry.registerComponent(appName, () => App);
