// biome-ignore lint/complexity/noStaticOnlyClass: <explanation>
export class Logger {
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  public static error(...e: any) {
    console.error(...e);
  }
}
