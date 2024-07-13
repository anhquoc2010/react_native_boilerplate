import * as React from 'react';
import SettingsScreens from '../../../screens/Main/Settings';
import AppHelper from '@utils/AppHelper';

export default function SettingsStack() {
  return <>{AppHelper.createScreenList(SettingsScreens)}</>;
}
