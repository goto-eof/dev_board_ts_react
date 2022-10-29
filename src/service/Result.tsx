export default class Result<T> {
  public isError: boolean;
  public data?: T;
  public errorMessage?: string;

  constructor(isError: boolean) {
    this.isError = isError;
  }
}
