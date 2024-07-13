import Api, { TError } from '@utils/Api';
import _ from 'lodash';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';

const initialMetadata = {
  count: 10,
  total: 0,
  page: 0,
  pageCount: 1,
};

export interface IResultUseRequest<TData> {
  readonly loading: boolean;
  readonly data?: TData;
  readonly metadata: {
    count: number;
    total: number;
    page: number;
    pageCount: number;
  };
  readonly error: TError | null;
  readonly setLoading: Dispatch<SetStateAction<boolean>>;
  readonly setData: Dispatch<any>;
  readonly setMetadata: Dispatch<
    SetStateAction<{
      count: number;
      total: number;
      page: number;
      pageCount: number;
    }>
  >;
  readonly setError: Dispatch<SetStateAction<TError | null>>;
  readonly queryParams: any;
  readonly fetch: (
    options?:
      | {
          queryParams?: any;
          overrideQueryParams?: boolean | undefined;
        }
      | undefined,
  ) => Promise<boolean>;
}

type TUseRequest = <TData = { [key: string]: any }>(
  url: string,
  params?: { queryParams?: { [key: string]: any }; useLazyLoad?: boolean; defaultData?: any },
) => IResultUseRequest<TData>;

const useRequest: TUseRequest = (url, params) => {
  const [queryParams, setQueryParams] = useState(params?.queryParams);

  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any>(params?.defaultData);
  const [metadata, setMetadata] = useState<{
    count: number;
    total: number;
    page: number;
    pageCount: number;
  }>(initialMetadata);

  const [error, setError] = useState<TError | null>(null);

  const fetch = async (options?: { queryParams?: any; overrideQueryParams?: boolean }) => {
    let newQueryParams;
    if (options?.queryParams && options?.overrideQueryParams) {
      newQueryParams = options.queryParams;
    } else {
      newQueryParams = options?.queryParams
        ? _.merge(queryParams, options?.queryParams)
        : queryParams;
    }

    if (options?.queryParams) {
      setQueryParams(newQueryParams);
    }

    /* istanbul ignore else */
    if (url) {
      setLoading(true);
      setError(null);
      try {
        const response = await Api.get(url, newQueryParams);
        const { data: serverData } = response;
        /* istanbul ignore else */
        if (response.page) {
          setMetadata({
            count: response.count,
            total: response.total,
            page: response.page,
            pageCount: response.pageCount,
          });
        }
        // setData must be at the bottom (for "data useEffect(...,[data])" at parent components)
        setLoading(false);
        setData(serverData);
        return true;
      } catch (e: any) {
        setLoading(false);
        setError(e);
        return false;
      }
    }
    /* istanbul ignore next */
    return false;
  };

  useEffect(() => {
    /* istanbul ignore else */
    if (!params?.useLazyLoad) {
      fetch();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    loading,
    data,
    metadata,
    error,
    setLoading,
    setData,
    setMetadata,
    setError,
    queryParams,
    fetch,
  } as const;
};

export default useRequest;
