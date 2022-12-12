export default interface ResultI<T> {
  result: T;
  success: boolean;
  refresh_token?: boolean;
}
