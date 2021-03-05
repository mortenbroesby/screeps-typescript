import { LRUCache, LRUCacheOptions } from "screeps-lru-cache";

export class Cache<TKey = string, TValue = any> extends LRUCache<TKey, TValue> {
  public constructor(options?: LRUCacheOptions<TKey, TValue>) {
    const cacheOptions: LRUCacheOptions<TKey, TValue> = {
      ...options,
      gameInstance: Game
    };

    super(cacheOptions);
  }
}
