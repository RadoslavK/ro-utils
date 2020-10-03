type ConstructorParams<T> = {
  readonly key: string;
  readonly parseRawObject?: (value: string) => T;
  readonly parseValue?: (value: T) => string;
};

export class LocalStorageManager<T> {
  private readonly key: string;
  private readonly parseRawObject?: (rawObject: string) => T;
  private readonly parseValue?: (value: T) => string;

  constructor(params: ConstructorParams<T>) {
    this.key = params.key;
    this.parseRawObject = params.parseRawObject;
    this.parseValue = params.parseValue;
  }

  public load = (defaultValue: T): T => {
    const rawObject = localStorage.getItem(this.key);

    if (!rawObject) {
      return defaultValue;
    }

    return (this.parseRawObject ?? JSON.parse)(rawObject);
  };

  public save = (value: T): void => {
    const rawObject = (this.parseValue ?? JSON.stringify)(value);

    localStorage.setItem(this.key, rawObject);
  };
}