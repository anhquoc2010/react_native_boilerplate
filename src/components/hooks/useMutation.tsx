import Api, { TError } from '@utils/Api';
import { Dispatch, SetStateAction, useState } from 'react';

export type TResultUseMutation<TResult, TBody> = readonly [
  (body: TBody) => Promise<boolean>,
  {
    readonly loading: boolean;
    readonly data: TResult;
    readonly error: TError | null;
    readonly setLoading: Dispatch<SetStateAction<boolean>>;
    readonly setData: Dispatch<any>;
    readonly setError: Dispatch<SetStateAction<TError | null>>;
  },
];

type TUseMutation = <TResult = any, TBody = any>(
  url: string,
  method?: 'POST' | 'PUT' | 'PATCH' | 'DELETE',
) => TResultUseMutation<TResult, TBody>;

const useMutation: TUseMutation = (url, method = 'POST') => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any>();
  const [error, setError] = useState<TError | null>(null);

  const trigger = async (body: any) => {
    /* istanbul ignore else */
    if (url) {
      setLoading(true);
      setError(null);
      try {
        let response;
        switch (method) {
          case 'PUT':
            response = await Api.put(url, body);
            break;
          case 'PATCH':
            response = await Api.patch(url, body);
            break;
          case 'DELETE':
            response = await Api.del(url, body);
            break;
          default:
            response = await Api.post(url, body);
        }
        const { data: serverData } = response;
        setLoading(false);
        setData(serverData);
        return true;
      } catch (e: any) {
        setLoading(false);
        setError(e);
        return false;
      }
    }
    return false;
  };

  return [trigger, { loading, data, error, setLoading, setData, setError }] as const;
};

export default useMutation;
