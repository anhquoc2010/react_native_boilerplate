import store from '@core/configs/store';
import { ActionReducerMapBuilder } from '@reduxjs/toolkit';
import _ from 'lodash';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';

/**
 * Redux Type
 */

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch<any>;
// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

/**
 * Redux
 */
class CRedux {
  private static _instance: CRedux;

  private constructor() {
    // ...
  }

  public static get Instance(): CRedux {
    /* istanbul ignore else */
    if (!this._instance) {
      this._instance = new this();
    }
    return CRedux._instance;
  }

  createObjectInitialState = <DataType = { [key: string]: any }>() => {
    const result: {
      loading: boolean;
      data?: DataType;
      error: null;
    } = {
      loading: false,
      data: undefined,
      error: null,
    };
    return result;
  };

  createArrayInitialState = <ItemType = { [key: string]: any }>() => {
    const result = {
      loading: false,
      data: [] as ItemType[],
      metadata: {
        count: 10,
        total: 0,
        page: 1,
        pageCount: 1,
      },
      error: null,
      filter: {},
    };
    return result;
  };

  createObjectReducer = (builder: ActionReducerMapBuilder<any>, thunk: any, key?: string) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    builder.addCase(thunk.pending, (state, action) => {
      if (key) {
        state[key].loading = true;
        // if (action.meta.arg) {
        //   state[key].data = action.meta.arg;
        // }
        state[key].error = null;
      } else {
        state.loading = true;
        // if (action.meta.arg) {
        //   state.data = action.meta.arg;
        // }
        state.error = null;
      }
    });
    builder.addCase(thunk.fulfilled, (state, action) => {
      if (key) {
        state[key].loading = false;
        state[key].data = action.payload.data;
      } else {
        state.loading = false;
        state.data = action.payload.data;
      }
    });
    builder.addCase(thunk.rejected, (state, action) => {
      if (key) {
        state[key].loading = false;
        state[key].error = action.payload;
      } else {
        state.loading = false;
        state.error = action.payload;
      }
    });
  };

  createArrayReducer = (builder: ActionReducerMapBuilder<any>, thunk: any, key?: string) => {
    builder.addCase(thunk.pending, (state, action) => {
      if (key) {
        state[key].loading = true;
        state[key].error = null;
        const filter = _.omit(action.meta.arg, 'limit', 'offset', 'page', 'perPage');
        if (filter.s) {
          state[key].filter = JSON.parse(filter.s);
        }
      } else {
        state.loading = true;
        state.error = null;
        const filter = _.omit(action.meta.arg, 'limit', 'offset', 'page', 'perPage');
        if (filter.s) {
          state.filter = JSON.parse(filter.s);
        }
      }
    });
    builder.addCase(thunk.fulfilled, (state, action) => {
      if (key) {
        state[key].loading = false;
        if (action.payload.page === 1) {
          state[key].data = action.payload.data;
        } else {
          state[key].data = [...state[key].data, ...action.payload.data];
        }
        state[key].metadata = {
          count: action.payload.count,
          total: action.payload.total,
          page: action.payload.page,
          pageCount: action.payload.pageCount,
        };
      } else {
        state.loading = false;
        if (action.payload.page === 1) {
          state.data = action.payload.data;
        } else {
          state.data = [...state.data, ...action.payload.data];
        }
        state.metadata = {
          count: action.payload.count,
          total: action.payload.total,
          page: action.payload.page,
          pageCount: action.payload.pageCount,
        };
      }
    });
    builder.addCase(thunk.rejected, (state, action) => {
      if (key) {
        state[key].loading = false;
        state[key].error = action.payload;
      } else {
        state.loading = false;
        state.error = action.payload;
      }
    });
  };

  resetTempField = () => ({
    ['loading']: false,
    ['error']: null,
  });
}
const Redux = CRedux.Instance;
export default Redux;
