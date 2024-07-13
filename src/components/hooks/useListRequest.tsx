import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useTheme } from '@react-navigation/native';
import useRequest, { IResultUseRequest } from './useRequest';
import { FlatList, FlatListProps, RefreshControl } from 'react-native';
import Loading from '@components/Common/Loading';
import ErrorText from '@components/custom/Text/ErrorText';
import _ from 'lodash';

const PAGE_SIZE = 10;

interface RenderFlatListProps extends Omit<FlatListProps<any>, 'data'> {
  data?: any;
}

interface IResultUseListRequest<TItem> extends Omit<IResultUseRequest<TItem>, 'data'> {
  data: TItem[];
  readonly flatListRef: React.RefObject<FlatList<any>>;
  readonly refresh: (
    options?:
      | {
          showRefreshing?: boolean | undefined;
          queryParams?: { [key: string]: any };
          overrideQueryParams?: boolean | undefined;
        }
      | undefined,
  ) => Promise<void>;
  readonly renderFlatList: (flatListProps?: RenderFlatListProps | undefined) => JSX.Element | null;
}

type TUseListRequest = <TItem = { [key: string]: any }>(
  url: string,
  params?:
    | {
        queryParams?: { [key: string]: any };
        defaultData?: Array<{ [key: string]: any }>;
        updateData?: ((previousQueryData: any) => any) | undefined;
      }
    | undefined,
) => IResultUseListRequest<TItem>;

const useListRequest: TUseListRequest = (url, params) => {
  const flatListRef = useRef<FlatList>(null);
  const theme = useTheme();

  const [refreshStatus, setRefreshStatus] = useState(
    'inactive' as 'active' | 'silentActive' | 'inactive',
  );

  const [data, setData] = useState<Array<any>>([]);

  const limit = useMemo(
    () => params?.queryParams?.limit || PAGE_SIZE,
    [params?.queryParams?.limit],
  );

  const {
    loading,
    data: rawData,
    metadata,
    queryParams,
    error,
    setLoading,
    setMetadata,
    setError,
    fetch,
  } = useRequest(url, {
    ...params,
    queryParams: {
      page: 1,
      limit,
    },
    defaultData: params?.defaultData || [],
  });

  const fetchMore = async () => {
    /* istanbul ignore else */
    if (url) {
      /* istanbul ignore else */
      if (metadata.page < metadata.pageCount) {
        fetch({ queryParams: { page: metadata.page + 1 } });
      }
    }
  };

  useEffect(() => {
    const handledData = params?.updateData ? params?.updateData(rawData) : rawData;
    if (!metadata.page || metadata.page === 1) {
      setData(handledData);
    } else {
      const merged = data.slice(0);
      const offset = metadata.page ? (metadata.page - 1) * limit : 0;
      for (let i = 0; i < handledData.length; ++i) {
        merged[offset + i] = handledData[i];
      }
      setData(merged);
    }
    setRefreshStatus('inactive');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rawData]);

  const refresh = async (options?: {
    showRefreshing?: boolean;
    queryParams?: any;
    overrideQueryParams?: boolean;
  }) => {
    if (options?.showRefreshing) {
      setRefreshStatus('active');
    } else {
      setRefreshStatus('silentActive');
    }

    const newQueryParams = _.merge(options?.queryParams, { page: 1 });
    await fetch({ queryParams: newQueryParams, overrideQueryParams: options?.overrideQueryParams });
    setRefreshStatus('inactive');
  };

  const renderFooter = () => {
    if (loading && refreshStatus !== 'active' && refreshStatus !== 'silentActive') {
      return <Loading testID="Loading" className="my-1" />;
    }
    if (error) {
      return <ErrorText error={error} />;
    }
    return null;
  };

  const onEndReached = async (
    onEndReachedInfo: {
      distanceFromEnd: number;
    },
    flatListProps?: RenderFlatListProps,
  ) => {
    /* istanbul ignore else */
    if (metadata.page < metadata.pageCount && !loading) {
      await fetchMore();
    }
    /* istanbul ignore else */
    if (flatListProps?.onEndReached) flatListProps?.onEndReached(onEndReachedInfo);
  };

  const renderFlatList = (flatListProps?: RenderFlatListProps) => {
    if (flatListProps) {
      return (
        <FlatList
          ref={flatListRef}
          data={data}
          keyExtractor={item => item.id}
          ListFooterComponent={renderFooter}
          refreshControl={
            <RefreshControl
              testID="RefreshControl"
              refreshing={refreshStatus === 'active'}
              onRefresh={() => {
                refresh({ showRefreshing: true });
                flatListProps?.onRefresh?.();
              }}
              tintColor={theme.colors.primary}
            />
          }
          {...flatListProps}
          onRefresh={undefined}
          onEndReached={info => onEndReached(info, flatListProps)}
        />
      );
    }
    return null;
  };

  return {
    flatListRef,
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
    refresh,
    renderFlatList,
  } as const;
};

export default useListRequest;
