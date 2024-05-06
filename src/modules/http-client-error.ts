export class FailedFetchError extends Error {
  constructor(cause?: unknown) {
    super();
    this.name = 'FAILED_FETCH_ERROR';
    this.message = 'データ取得に失敗しました';
    this.cause = cause;
    console.error(cause);
  }
}

export const isFailedFetchError = (error: unknown): error is FailedFetchError => {
  return error instanceof FailedFetchError;
};

export class SystemError extends Error {
  constructor(cause?: unknown) {
    super();
    this.name = 'SYSTEM_ERROR';
    this.message = 'システムエラーです';
    this.cause = cause;
    console.error(cause);
  }
}

export const isSystemError = (error: unknown): error is SystemError => {
  return error instanceof SystemError;
};

export type HttpClientError = FailedFetchError | SystemError;

export const isHttpClientError = (error: unknown): error is HttpClientError => {
  return isFailedFetchError(error) || isSystemError(error);
};
