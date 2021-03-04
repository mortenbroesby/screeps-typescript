interface CacheOptions<T> {
  ttl?: number;
  max?: number;
  data?: T[];
}

export interface ICache<T> {
  key: string;
  value: T;

  expireTick: number;
  next: ICache<T>;
  prev: ICache<T>;
}

export class Cache<T> {
  private _data: Map<string, ICache<T>> = new Map<string, ICache<T>>();

  private _max?: number;
  private _ttl?: number;

  private _head?: ICache<T>;
  private _tail?: ICache<T>;

  public constructor({ ttl, max = 100, data }: CacheOptions<T> = {}) {
    this._max = max;
    this._ttl = ttl;

    if (data) {
      Object.keys(data).forEach((key: any) => this.set(key, data[key]));
    }
  }

  public get head(): ICache<T> | undefined {
    return this._head;
  }
  public set head(entry: ICache<T> | undefined) {
    this._head = entry;
  }

  public get tail(): ICache<T> | undefined {
    return this._tail;
  }
  public set tail(entry: ICache<T> | undefined) {
    this._tail = entry;
  }

  public get data(): Map<string, ICache<T>> {
    return this._data;
  }
  public set data(data: Map<string, ICache<T>>) {
    this._data = data;
  }

  public get ttl(): number | undefined {
    return this._ttl;
  }

  public get max(): number | undefined {
    return this._max;
  }

  public get size(): number {
    return this.evict();
  }

  public keys(): { next: () => string | undefined } {
    return this._iterator<string>(entry => entry.key);
  }

  private _isExpired<T>(entry: ICache<T>) {
    return entry ? entry.expireTick <= Game.time : true;
  }

  public evict(): number {
    let count = 0;

    const max = this.max;

    for (let current = this.head; current; current = current.next) {
      ++count;

      if ((max && max < count) || this._isExpired(current)) {
        this.data.delete(current.key);
        this._remove(current);
      }
    }

    return count;
  }

  public has(key: string): boolean {
    const entry = this.data.get(key);
    if (entry) {
      if (entry.expireTick && entry.expireTick < Game.time) {
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
      if (entry.expireTick && entry.expireTick < Game.time) {
        this.delete(key);
      } else {
        return entry.value;
      }
    }

    return undefined;
  }

  public set(key: string, value: T): Cache<T> {
    const exists = this.data.get(key);

    const expireTick = this.ttl ? Game.time + this.ttl : Infinity;

    const current: ICache<T> = {
      key,
      value,
      expireTick
    } as ICache<T>;

    if (exists?.key) {
      this._remove(exists);
    } else {
      this.data.set(key, current);
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
    accessFn: (item: ICache<T>) => TExpectedReturn
  ): { next: () => TExpectedReturn | undefined } {
    const max = this.max ?? Infinity;
    const now = this.ttl ? Game.time : false;

    let current = this.head;

    const count = 0;

    return {
      next: () => {
        while (current && (count > max || now > current.expireTick)) {
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

  private _remove(current: ICache<T>) {
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

  private _insert(current: ICache<T>) {
    if (!this.head) {
      this.head = current;
      this.tail = current;
    } else {
      const node = this.head;

      current.prev = node.prev;
      current.next = node;

      if (!node.prev) {
        this.head = current;
      } else {
        node.prev.next = current;
      }

      node.prev = current;
    }
  }
}
