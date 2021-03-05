interface CacheOptions<T> {
  ttl?: number;
  max?: number;
  data?: T[];
}

export interface ICache<T> {
  key: string;
  value: T;

  expireTick?: number;
  next: ICache<T>;
  prev: ICache<T>;
}

interface Iterable<T> {
  [Symbol.iterator](): Iterator<T>;
}

/**
 * A cache that can exhibit both least recently used (LRU) and max time to live (TTL) eviction policies.
 *
 * Internally the cache is backed by a `Map` but also maintains a linked list of entries to support the eviction policies.
 *
 * Credits go to:
 *  @ ianp -> https://github.com/ianp/es6-lru-cache
 *  @ warinternal -> https://github.com/screepers/screeps-snippets
 */
export class Cache<TCacheType> implements Iterable<ICache<TCacheType>> {
  private _data: Map<string, ICache<TCacheType>> = new Map<string, ICache<TCacheType>>();

  private _max?: number;
  private _ttl?: number;

  private _head?: ICache<TCacheType>;
  private _tail?: ICache<TCacheType>;

  /**
   * Cache constructor
   *
   * @param {number} ttl - The maximum time to live, in milliseconds.
   * @param {number} max - The maximum number of entries in the cache.
   * @param {Object | Iterable} data - The data to initialize the cache with.
   */
  public constructor({ ttl, max, data }: CacheOptions<TCacheType> = {}) {
    this._max = max;
    this._ttl = ttl;

    if (data) {
      Object.keys(data).forEach((key: any) => this.set(key, data[key]));
    }

    return this;
  }

  public get head(): ICache<TCacheType> | undefined {
    return this._head;
  }
  public set head(entry: ICache<TCacheType> | undefined) {
    this._head = entry;
  }

  public get tail(): ICache<TCacheType> | undefined {
    return this._tail;
  }
  public set tail(entry: ICache<TCacheType> | undefined) {
    this._tail = entry;
  }

  public get data(): Map<string, ICache<TCacheType>> {
    return this._data;
  }
  public set data(data: Map<string, ICache<TCacheType>>) {
    this._data = data;
  }

  public get ttl(): number | undefined {
    return this._ttl;
  }

  public get max(): number {
    return this._max ?? Infinity;
  }

  public get size(): number {
    return this.evict();
  }

  public keys(): Iterator<string, any, undefined> {
    return this._iterator<string>(entry => entry.key);
  }

  public evict(): number {
    let count = 0;

    for (let current = this.head; current; current = current.next) {
      ++count;

      if (this._hasReachedMax(count) || this._hasExpired(current)) {
        this.data.delete(current.key);
        this._remove(current);
      }
    }

    return count;
  }

  public has(key: string): boolean {
    const entry = this.data.get(key);
    if (entry) {
      if (this._hasExpired(entry)) {
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

  public get(key: string): TCacheType | undefined {
    const entry = this.data.get(key);
    if (entry) {
      if (this._hasExpired(entry)) {
        this.delete(key);
      } else {
        return entry.value;
      }
    }

    return undefined;
  }

  public set(key: string, value: TCacheType): Cache<TCacheType> {
    const exists = this.data.get(key);

    const current: ICache<TCacheType> = {
      key,
      value
    } as ICache<TCacheType>;

    if (this.ttl) {
      current.expireTick = Game.time + this.ttl;
    }

    if (exists?.key) {
      this._remove(exists);
    } else {
      this.data.set(key, current);
    }

    this._insert(current);
    this.evict();

    return this;
  }

  public entries(): Iterator<(string | TCacheType)[], any, undefined> {
    return this._iterator(entry => [entry.key, entry.value]);
  }

  /**
   * Provide iterator for looping.
   */
  public [Symbol.iterator](): Iterator<ICache<TCacheType>, any, undefined> {
    return this._iterator(entry => entry);
  }

  /**
   * Iterate over entries in cache.
   */
  public forEach(callback: (key: TCacheType, index: number) => void): void {
    let count = 0;

    const iterator = this._iterator(entry => {
      callback(entry.value, count);
      return true;
    });

    while (!iterator.next().done) {
      count++;
      void 0;
    }
  }

  /**
   * Has count reached max?
   *
   * @param count - The count to look up.
   */
  private _hasReachedMax(count: number): boolean {
    return this.max < count;
  }

  /**
   * Has entry expired?
   *
   * @param entry - The entry to look-up.
   */
  private _hasExpired<T>(entry?: ICache<T>): boolean {
    return entry ? (entry?.expireTick ?? Infinity) <= Game.time : true;
  }

  /**
   * Iterate over entries in cache.
   */
  private _iterator<TValue>(iterateFn: (item: ICache<TCacheType>) => TValue): Iterator<TValue> {
    let current = this.head;
    const count = 0;

    return {
      next: () => {
        while (current && (this._hasReachedMax(count) || this._hasExpired(current))) {
          this.data.delete(current.key);
          this._remove(current);
          current = current.next;
        }

        const iteration = current;
        current = current && current.next;

        if (iteration) {
          return {
            value: iterateFn(iteration),
            done: false
          };
        }

        return {
          value: undefined,
          done: true
        };
      }
    };
  }

  /**
   * Remove entry from the linked list.
   */
  private _remove(current: ICache<TCacheType>) {
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

  /**
   * Insert entry into the linked list.
   */
  private _insert(current: ICache<TCacheType>) {
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
