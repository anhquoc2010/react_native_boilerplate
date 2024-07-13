/* eslint-disable no-console */
import Config from 'react-native-config';
import _ from 'lodash';
import axios from 'axios';
import i18next from 'i18next';
import { logout } from '@store/auth';

export type TError = {
  code: number;
  messages?: Array<string>;
  message?: string;
};

type TErrorData = {
  statusCode: number;
  message?:
    | {
        code: string;
        description: string;
      }[]
    | string;
  error: string;
};

export const Axios = axios.create({
  baseURL: Config.API_URL,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
  timeout: 12000,
});

const handleException = (err: any): TError => {
  let errorData: TErrorData = {
    statusCode: 500,
    error: 'Internal Server Error',
  };

  if (err.response?.data?.status === 401) {
    global.app.dispatch(logout());
  }

  const statusCode = err.response?.status || 500;

  if (err.response && err.response.data) {
    const serverErrorData = err.response?.data;
    if (typeof serverErrorData === 'string') {
      if (serverErrorData.includes('502 Bad Gateway')) {
        errorData = {
          statusCode: 502,
          error: 'Bad Gateway',
        };
      } else {
        errorData = {
          statusCode,
          error: serverErrorData,
          // message: serverErrorData,
        };
      }
    } else if (
      typeof serverErrorData === 'object' &&
      serverErrorData.statusCode &&
      serverErrorData.error &&
      serverErrorData.message
    ) {
      errorData = {
        statusCode,
        error: serverErrorData.error,
        message: serverErrorData.message,
      };
    }
  } else {
    if (!errorData.statusCode || errorData.statusCode === 500) {
      errorData = {
        statusCode,
        error: '',
      };
    }
  }

  if (err.message && err.message.includes('timeout of')) {
    errorData = {
      statusCode: 408,
      error: 'Request Time Out',
    };
  }
  if (err.message && err.message.includes('Network Error')) {
    errorData = {
      statusCode: 503,
      error: 'Service Unavailable',
    };
  }

  const messages = [] as string[];

  if (errorData.message) {
    if (Array.isArray(errorData.message)) {
      errorData.message.forEach((e: any) => {
        messages.push(e.description);
      });
    } else {
      if (typeof errorData.message === 'string') {
        messages.push(errorData.message);
      } else {
        /* istanbul ignore else */
        if ((errorData.message as any).description) {
          messages.push((errorData.message as any).description);
        }
      }
    }
  } else {
    messages.push(i18next.t(`exception.${errorData.statusCode}`));
  }

  return {
    code: errorData.statusCode,
    messages,
  };
};

Axios.interceptors.response.use(
  res => {
    /* istanbul ignore next */
    // @ts-ignore
    if (__DEV__ && !process.env.JEST_WORKER_ID) {
      console.log('Url: ', decodeURIComponent(res.request.responseURL));
    }
    return res.data;
  },
  err => {
    /* istanbul ignore else */
    if (__DEV__) {
      if (err.response) {
        console.log(
          'Error:',
          `[${err.response?.status}][${err.response?.config?.method?.toUpperCase()}][${
            err.request?.responseURL
          }]`,
          err.response?.data || err.response,
        );
      } else {
        console.log('Error:', err.message);
      }
    }
    return Promise.reject(handleException(err));
  },
);

function requestWrapper(method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE') {
  return async (url: string, data?: Object): Promise<any> => {
    const isFullUrl = _.startsWith(url, 'http');
    if (
      !isFullUrl &&
      global.app.token &&
      !(Axios.defaults.headers?.common?.Authorization as string)?.includes(global.app.token)
    ) {
      Axios.defaults.headers.common.Authorization = `${global.app.token}`;
    }

    switch (method) {
      case 'POST':
        return Axios.post(url, data);
      case 'PUT':
        return Axios.put(url, data);
      case 'PATCH':
        return Axios.patch(url, data);
      case 'DELETE':
        return Axios.delete(url, data);
      default:
        return Axios.get(url, { params: data });
    }
  };
}

class CApi {
  private static _instance: CApi;

  private constructor() {
    // ...
  }

  public static get Instance(): CApi {
    /* istanbul ignore else */
    if (!this._instance) {
      this._instance = new this();
    }
    return CApi._instance;
  }

  get = requestWrapper('GET');

  post = requestWrapper('POST');

  put = requestWrapper('PUT');

  patch = requestWrapper('PATCH');

  del = requestWrapper('DELETE');

  setHeader = (data: {
    'X-User-Agent'?: string | number | boolean;
    'X-ClientId'?: string | number | boolean;
    'X-locale'?: string | number | boolean;
    Authorization?: string | number | boolean;
    'Content-Type'?: string | number | boolean;
    'X-Signature'?: string | number | boolean;
    'X-DeviceFingerprint'?: string | number | boolean;
  }) => {
    for (const prop in data) {
      switch (prop) {
        case 'X-User-Agent':
          Axios.defaults.headers.common['X-User-Agent'] = data['X-User-Agent'] as any;
          break;
        case 'X-locale':
          Axios.defaults.headers.common['X-locale'] = data['X-locale'] as any;
          break;
        case 'Authorization':
          Axios.defaults.headers.common.Authorization = data.Authorization as any;
          break;
        case 'Content-Type':
          Axios.defaults.headers.post['Content-Type'] = data['Content-Type'] as any;
          break;
        case 'X-Signature':
          Axios.defaults.headers.common['X-Signature'] = data['X-Signature'] as any;
          break;
        case 'X-DeviceFingerprint':
          Axios.defaults.headers.common['X-DeviceFingerprint'] = data['X-DeviceFingerprint'] as any;
          break;
      }
    }
  };
}
const Api = CApi.Instance;
export default Api;
