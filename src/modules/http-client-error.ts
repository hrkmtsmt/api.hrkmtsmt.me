export class ExternalSystemError extends Error {
  private body?: unknown;

  constructor(error?: unknown) {
    super();
    this.name = "EXTERNAL_SYSTEM_ERROR";
    this.message = "データ取得に失敗しました";
    this.body = error;
    console.error(this.body);
  }

  public static isEqualInstance(error: unknown): error is ExternalSystemError {
    return error instanceof ExternalSystemError;
  }
}

export class InternalSystemError extends Error {
  private body?: unknown;

  constructor(error?: unknown) {
    super();
    this.name = "INTERNAL_SYSTEM_ERROR";
    this.message = "システムエラーです";
    this.body = error;
    console.error(this.body);
  }

  public static isEqualInstance(error: unknown): error is InternalSystemError {
    return error instanceof InternalSystemError;
  }
}

export type HttpClientError = ExternalSystemError | InternalSystemError;

export const isHttpClientError = (error: unknown): error is HttpClientError => {
  return ExternalSystemError.isEqualInstance(error) || InternalSystemError.isEqualInstance(error);
};
