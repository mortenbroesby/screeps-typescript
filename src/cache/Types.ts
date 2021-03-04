export interface ICache<T> {
  key: string;
  value: T;

  expires: number;
  next: T;
  prev: T;
}
