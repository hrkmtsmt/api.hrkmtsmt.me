import camelcaseKeys from "camelcase-keys";
import { ExternalSystemError, InternalSystemError } from ".";

export const HTTP_METHODS = {
  get: "GET",
  post: "POST",
} as const;

type HttpMethods = (typeof HTTP_METHODS)[keyof typeof HTTP_METHODS];

type Headers = Record<string, string>;

const h: Headers = { "Content-Type": "application/json; charset=utf-8" };

export class Client {
  private BASE_URL: string;

  private headers: Headers;

  constructor(baseURL: string, headers: Headers = h) {
    this.BASE_URL = baseURL;
    this.headers = headers;
  }

  private toURL(path: string) {
    return `${this.BASE_URL}${path}`;
  }

  private body<U>(body?: U) {
    if (!body) {
      return undefined;
    }

    if (body instanceof FormData || typeof body === "string") {
      return body;
    }

    return JSON.stringify(body);
  }

  private async response<T>(response: Awaited<ReturnType<typeof fetch>>) {
    const type = response.headers.get("Content-Type");

    if (type?.includes("application/json")) {
      return camelcaseKeys((await response.json()) as never, { deep: true }) as T;
    }

    if (
      type?.includes("text/plain") ||
      type?.includes("text/html") ||
      type?.includes("application/x-www-form-urlencoded") || 
      type?.includes("application/atom")
    ) {
      return response.text() as T;
    }

    return response.blob() as T;
  }

  private async fetcher<T, U>(url: string, method: HttpMethods, body?: U, headers?: Headers): Promise<T> {
    try {
      const response = await fetch(url, {
        method,
        body: this.body<U>(body),
        headers: { ...this.headers, ...headers },
      });

      if (response.status === 204) {
        return undefined as T;
      }

      if (response.ok) {
        return this.response<T>(response);
      }

      throw new ExternalSystemError(await this.response(response));
    } catch (error: unknown) {
      if (ExternalSystemError.isEqualInstance(error)) {
        throw error;
      }

      throw new InternalSystemError({ url, error });
    }
  }

  public async get<T>(path: string, headers?: Headers): Promise<T> {
    return this.fetcher(this.toURL(path), HTTP_METHODS.get, undefined, { ...this.headers, ...headers });
  }

  public async post<T, U>(path: string, body?: U, headers?: Headers): Promise<T> {
    return this.fetcher(this.toURL(path), HTTP_METHODS.post, body, { ...this.headers, ...headers });
  }
}
