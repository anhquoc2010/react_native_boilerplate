import { createSlice } from '@reduxjs/toolkit';
import moment from 'moment';
import { Appearance } from 'react-native';
import i18n from '@configs/i18n';
import RNLocalize from 'react-native-localize';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { PersistConfig, persistReducer } from 'redux-persist';
import DeviceInfo from 'react-native-device-info';

export async function changeLanguageConfig(language: string) {
  await i18n.changeLanguage(language);
  moment.locale(language);
}

function getInitialLanguage(): App.Language {
  try {
    const language = RNLocalize.getLocales()[0]?.languageCode === 'vi' ? 'vi' : 'en';
    moment.locale(language);
    return language;
  } catch (error) {
    return 'en';
  }
}

const NAME = 'app';
const INITIAL_STATE = {
  colorScheme: Appearance.getColorScheme() === 'dark' ? 'dark' : ('light' as App.ColorScheme),
  language: getInitialLanguage(),
};

const slice = createSlice({
  name: NAME,
  initialState: INITIAL_STATE,
  reducers: {
    switchTheme(state) {
      state.colorScheme = state.colorScheme === 'light' ? 'dark' : 'light';
      if (global.app.theme.colorScheme !== state.colorScheme) {
        global.app.theme.colorScheme = state.colorScheme;
        global.app.theme.toggleColorScheme();
      }
    },
    changeLanguage(state, action) {
      const language = action.payload;
      /* istanbul ignore else */
      if (language !== state.language) {
        state.language = language;
        changeLanguageConfig(language);
      }
    },
  },
});

const appPersistConfig: PersistConfig<typeof INITIAL_STATE> = {
  key: NAME,
  storage: AsyncStorage,
  keyPrefix: `${DeviceInfo.getBundleId()}.`,
};

const app = persistReducer(appPersistConfig, slice.reducer);

export const { switchTheme, changeLanguage } = slice.actions;

export default app;
