import ModalScreens from '@screens/Modal';
import { SwitchScreens } from '@routes';
import AuthScreens from '@screens/Auth';
import { BottomTabScreens } from './Main/index.bottomtab';
import FlatListScreens from '@screens/Main/Home/Example/FlatList';

export type ScreenName =
  | keyof typeof ModalScreens
  | keyof typeof SwitchScreens
  | keyof typeof AuthScreens
  | keyof typeof BottomTabScreens
  | keyof typeof FlatListScreens;
