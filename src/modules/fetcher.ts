import camelcaseKeys from 'camelcase-keys';
import { FailedFetchError, SystemError, isFailedFetchError } from './http-client-error';

type Headers = Record<string, string>;

export const fetcher = async <T>(url: string, headers?: Headers): Promise<T> => {
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers,
    });

    if (response.status === 204) {
      return undefined as void as T;
    }

    const data = await response.json();

    if (response.ok) {
      return camelcaseKeys(data as any, { deep: true }) as T;
    }

    throw new FailedFetchError();
  } catch (error: unknown) {
    if (isFailedFetchError(error)) {
      throw error;
    }

    throw new SystemError({ url, error });
  }
};
