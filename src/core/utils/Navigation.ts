import { ScreenName } from '@routes/Type';
import * as React from 'react';
import { StackActions, DrawerActions, NavigationContainerRef } from '@react-navigation/native';

class CNavigation {
  private static _instance: CNavigation;

  private constructor() {
    // ...
  }

  navigationRef = React.createRef<NavigationContainerRef<ReactNavigation.RootParamList>>();

  public static get Instance(): CNavigation {
    /* istanbul ignore else */
    if (!this._instance) {
      this._instance = new this();
    }
    return CNavigation._instance;
  }

  navigate(stack: ScreenName, data?: object | { screen: ScreenName; params?: any }) {
    // @ts-ignore
    return this.navigationRef.current?.navigate(stack, data);
  }

  getCurrentRoute() {
    return this.navigationRef.current?.getCurrentRoute();
  }

  canGoBack() {
    return this.navigationRef.current?.canGoBack();
  }

  getRootState() {
    return this.navigationRef.current?.getRootState();
  }

  goBack() {
    return this.navigationRef.current?.goBack();
  }

  push(stack: ScreenName, data?: object | { screen: ScreenName; params?: any }) {
    return this.navigationRef.current?.dispatch(StackActions.push(stack, data));
  }

  pop(count: number = 1) {
    return this.navigationRef.current?.dispatch(StackActions.pop(count));
  }

  popToTop() {
    return this.navigationRef.current?.dispatch(StackActions.popToTop());
  }

  openDrawer() {
    return this.navigationRef.current?.dispatch(DrawerActions.toggleDrawer());
  }
}
const Navigation = CNavigation.Instance;

export default Navigation;
