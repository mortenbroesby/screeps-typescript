import { ICache } from "./Types";

type CacheMap<T extends ICache<T>> = Map<string, T>;

export class Cache<T extends ICache<T>> {
  private _data: CacheMap<T> = new Map<string, T>();

  private _max: number;
  private _ttl: number;

  private _head: T | undefined;
  private _tail: T | undefined;

  public constructor(ttl = -1, max = 100, data: T[]) {
    this._max = max;
    this._ttl = ttl;

    if (data) {
      Object.keys(data).forEach((key: any) => this.set(key, data[key]));
    }
  }

  public get head(): T | undefined {
    return this._head;
  }
  public set head(entry: T | undefined) {
    this._head = entry;
  }

  public get tail(): T | undefined {
    return this._tail;
  }
  public set tail(entry: T | undefined) {
    this._tail = entry;
  }

  public get data(): CacheMap<T> {
    return this._data;
  }
  public set data(data: CacheMap<T>) {
    this._data = data;
  }

  public get ttl(): number {
    return this._ttl;
  }

  public get max(): number {
    return this._max;
  }

  public get size(): number {
    return this.evict();
  }

  public keys(): { next: () => void } {
    return this._iterator(entry => entry.key);
  }

  public evict(): number {
    let count = 0;

    const max = this.max;
    const now = this.ttl ? Date.now() : false;

    for (let curr = this.head; curr; curr = curr.next) {
      ++count;
      if ((max && max < count) || (now && now > curr.expires)) {
        this.data.delete(curr.key);
        this._remove(curr);
      }
    }

    return count;
  }

  public has(key: string): boolean {
    const entry = this.data.get(key);
    if (entry) {
      if (entry.expires && entry.expires < Date.now()) {
        this.delete(key);
      } else {
        return true;
      }
    }

    return false;
  }

  public clear(): void {
    this.data.clear();
    this.head = undefined;
    this.tail = undefined;
  }

  public delete(key: string): boolean {
    const target = this.data.get(key);
    if (target && this.data.delete(key)) {
      this._remove(target);
      return true;
    }

    return false;
  }

  public get(key: string): T | undefined {
    const entry = this.data.get(key);
    if (entry) {
      if (entry.expires && entry.expires < Date.now()) {
        this.delete(key);
      } else {
        return entry.value;
      }
    }

    return undefined;
  }

  public set(key: string, value: unknown): Cache<T> {
    let current: any = this.data.get(key);

    if (current?.key) {
      this._remove(current);
    } else {
      this.data.set(key, (current = {} as any));
    }

    current.key = key;
    current.value = value;

    if (this.ttl) {
      current.expires = Date.now() + this.ttl;
    }

    this._insert(current);
    this.evict();

    return this;
  }

  public entries(): { next: () => void } {
    return this._iterator(entry => [entry.key, entry.value]);
  }

  public [Symbol.iterator](): { next: () => void } {
    return this._iterator(entry => [entry.key, entry.value]);
  }

  public forEach(callback: (key: string, value: T) => void): void {
    const iterator = this._iterator<boolean>(entry => {
      callback(entry.key, entry.value);
      return true;
    });

    while (iterator.next()) {
      /* no-op */
    }
  }

  private _iterator<TExpectedReturn>(
    accessFn: (item: T) => TExpectedReturn
  ): { next: () => TExpectedReturn | undefined } {
    const max = this.max;
    const now = this.ttl !== -1 ? Date.now() : false;

    let current = this.head;

    const count = 0;

    return {
      next: () => {
        while (current && (count > max || now > current.expires)) {
          this.data.delete(current.key);
          this._remove(current);
          current = current.next;
        }

        const it = current;
        current = current && current.next;
        return it ? accessFn(it) : undefined;
      }
    };
  }

  private _remove(current: T) {
    if (!current.prev) {
      this.head = current.next;
    } else {
      current.prev.next = current.next;
    }

    if (!current.next) {
      this.tail = current.prev;
    } else {
      current.next.prev = current.prev;
    }
  }

  private _insert(curr: T) {
    if (!this.head) {
      this.head = curr;
      this.tail = curr;
    } else {
      const node = this.head;

      curr.prev = node.prev;
      curr.next = node;

      if (!node.prev) {
        this.head = curr;
      } else {
        node.prev.next = curr;
      }

      node.prev = curr;
    }
  }
}
