export class Cache<T> {
  private _value: T | undefined = undefined;

  public get() {
    return this._value;
  }

  public set(value: T) {
    this._value = value;
  }

  public clear() {
    this._value = undefined;
  }
}
