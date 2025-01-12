import camelcaseKeys from 'camelcase-keys';
import { ExternalSystemError, InternalSystemError } from '.';

export const HTTP_METHODS = {
  get: 'GET',
  post: 'POST',
} as const;

type HttpMethods = (typeof HTTP_METHODS)[keyof typeof HTTP_METHODS];

type Headers = Record<string, string>;

export class Client {
  private BASE_URL: string;

  private headers?: Headers;

  constructor(baseURL: string, headers?: Headers) {
    this.BASE_URL = baseURL;
    this.headers = headers;
  }

  private toURL(path: string) {
    return `${this.BASE_URL}${path}`;
  }

  private createBody<U>(body?: U) {
    if (!body) {
      return undefined;
    }

    if (body instanceof FormData) {
      return body;
    }

    return JSON.stringify(body);
  }

  private async fetcher<T, U>(url: string, method: HttpMethods, body?: U, headers?: Headers): Promise<T> {
    try {
      const response = await fetch(url, {
        mode: 'cors',
        method,
        body: this.createBody<U>(body),
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
          ...headers,
        },
      });

      if (response.status === 204) {
        return undefined as T;
      }

      const data = await response.json();

      if (response.ok) {
        return camelcaseKeys(data as never, { deep: true }) as T;
      }

      throw new ExternalSystemError(data);
    } catch (error: unknown) {
      if (ExternalSystemError.isEqualInstance(error)) {
        throw error;
      }

      throw new InternalSystemError({ url, error });
    }
  }

  public async get<T>(path: string): Promise<T> {
    return this.fetcher(this.toURL(path), HTTP_METHODS.get, undefined, this.headers);
  }

  public async post<T, U>(path: string, body?: U): Promise<T> {
    return this.fetcher(this.toURL(path), HTTP_METHODS.post, body, this.headers);
  }
}
