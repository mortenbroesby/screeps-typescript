import { LRUCache } from "screeps-lru-cache";

export class Cache<TKey = string, TValue = any> extends LRUCache<TKey, TValue> {}
