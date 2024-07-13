import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import Api from '@utils/Api';
import Redux from '@utils/Redux';
import _ from 'lodash';
import DeviceInfo from 'react-native-device-info';
import { Settings, Platform } from 'react-native';
import EncryptedStorage from 'react-native-encrypted-storage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { PersistConfig, persistReducer } from 'redux-persist';
import Sentry from '@plugins/Sentry';

const NAME = 'auth';
const INITIAL_STATE = {
  ...Redux.createObjectInitialState(),
};

export const login = createAsyncThunk<any, Auth.Login>(`${NAME}/login`, async (data, thunkAPI) => {
  try {
    const response = await Api.post('/auth/login', data);
    global.app.token = response.data.token;

    Sentry.setUser(response.data);

    return response;
  } catch (error) {
    return thunkAPI.rejectWithValue(error);
  }
});

export const logout = createAsyncThunk<any>(`${NAME}/logout`, async (data, thunkAPI) => {
  try {
    // Call server to revoke token
    // Sentry.setUser(null);
  } catch (error) {
    return thunkAPI.rejectWithValue(error);
  }
});

const slice = createSlice({
  name: NAME,
  initialState: INITIAL_STATE,
  reducers: {
    setNewToken: (state, action) => {
      if (state.data) {
        state.data.token = action.payload;
      }
    },
  },
  extraReducers: builder => {
    Redux.createObjectReducer(builder, login);
    builder.addCase(logout.fulfilled, () => {
      global.app.token = '';
      return INITIAL_STATE;
    });
  },
});

export function createEncryptedStorage() {
  return {
    async getItem(key: string) {
      if (Platform.OS === 'ios' && !Settings.get('hasOpened')) {
        await EncryptedStorage.clear();
        Settings.set({ hasOpened: true });
      }
      const item = await AsyncStorage.getItem(key);
      if (item) {
        const parseItem = JSON.parse(item);
        if (parseItem?.data) {
          const loginData = JSON.parse(parseItem.data);
          const token = await EncryptedStorage.getItem('token');
          if (loginData && token) {
            loginData.token = token;
          }
          parseItem.data = JSON.stringify(loginData);
          return JSON.stringify(parseItem);
        }
      }

      return item;
    },
    async setItem(key: string, item: string) {
      const parseItem = JSON.parse(item);
      if (parseItem?.data) {
        const loginData = JSON.parse(parseItem.data);

        if (loginData?.token) {
          await EncryptedStorage.setItem('token', loginData.token);
          parseItem.data = JSON.stringify(_.omit(loginData, 'token'));
        } else {
          const token = await EncryptedStorage.getItem('token');
          if (token) {
            await EncryptedStorage.removeItem('token');
          }
        }
        const newItem = JSON.stringify(parseItem);

        return AsyncStorage.setItem(key, newItem);
      }
      return AsyncStorage.setItem(key, item);
    },
    async removeItem(key: string) {
      await EncryptedStorage.removeItem('token');
      return AsyncStorage.removeItem(key);
    },
  };
}

const authPersistConfig: PersistConfig<typeof INITIAL_STATE> = {
  key: NAME,
  storage: createEncryptedStorage(),
  keyPrefix: `${DeviceInfo.getBundleId()}.`,
  blacklist: ['loading', 'error'],
};

const auth = persistReducer(authPersistConfig, slice.reducer);

export const { setNewToken } = slice.actions;

export default auth;
