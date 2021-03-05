import { mockGlobal } from "screeps-jest";

import { Cache } from "./Cache";

mockGlobal<Game>("Game", {
  time: 1
});

describe("Cache [LRU] - Least recently used", () => {
  const cache = new Cache({ max: 3 });

  it("should limit the number of entries", () => {
    cache.set("a", 1);
    cache.set("b", 2);
    cache.set("c", 3);
    cache.set("d", 4);

    expect(cache.size).toBe(3);
  });

  it("should retain the most recent entries", () => {
    cache.set("a", 1);
    cache.set("b", 2);
    cache.set("c", 3);
    cache.set("d", 4);
    expect(cache.get("a")).toBe(undefined);
  });

  afterEach(() => {
    cache.clear();
  });
});

describe("Cache [Map] - Basic map-like functionality", () => {
  const cache = new Cache<number | undefined | null>({});

  it("should allow existing keys to be found", () => {
    cache.set("a", 42);
    expect(cache.has("a")).toBe(true);

    cache.set("b", undefined);
    expect(cache.has("b")).toBe(true);
  });

  it("should not find non existent keys", () => {
    expect(cache.has("z")).not.toBe(true);
  });

  it("should return this when setting values", () => {
    expect(cache.set("c", 77)).toBe(cache);
  });

  it("should allow existing keys to be retrieved", () => {
    cache.set("a", 42);
    expect(cache.get("a")).toBe(42);

    cache.set("b", null);
    expect(cache.get("b")).toBe(null);
  });

  it("should return undefined for missing keys", () => {
    expect(cache.get("z")).toBe(undefined);
  });

  it("should allow keys to be deleted", () => {
    cache.set("a", 23);
    expect(cache.delete("a")).toBe(true);
    expect(cache.get("a")).toBe(undefined);
  });

  it("should return false when deleting non-existent keys", () => {
    expect(cache.delete("a")).toBe(false);
  });

  it("should allow keys to be cleared", () => {
    cache.set("a", 23);
    cache.clear();
    expect(cache.get("a")).toBe(undefined);
  });

  it("should support key iteration", () => {
    cache.set("a", 42);
    cache.set("b", 42);
    cache.set("c", 42);

    let count = 0;
    const keys = cache.keys();

    while (keys.next().value && count < 10) {
      ++count;
    }

    expect(count).toBe(3);
  });

  it("should support native iteration", () => {
    const inputValues = [1, 2, 3];

    const testCache = new Cache({ data: inputValues });

    for (const { value } of testCache) {
      const lastItem = inputValues.pop();
      expect(value).toBe(lastItem);
    }
  });

  it("should support entries", () => {
    cache.set("a", 40);
    cache.set("b", 41);
    cache.set("c", 42);

    const entries = cache.entries();

    expect(entries.next().value).toStrictEqual(["c", 42]);
    expect(entries.next().value).toStrictEqual(["b", 41]);
    expect(entries.next().value).toStrictEqual(["a", 40]);

    cache.set("a", 40);
    cache.set("b", 41);
    cache.set("c", 42);
  });

  it("should support forEach looping", () => {
    const values = [1, 2, 3, 4];

    values.forEach(value => {
      cache.set(`${value}`, value);
    });

    let count = 0;
    cache.forEach(() => ++count);
    expect(count).toBe(4);

    count = 0;
    const reversed = values.reverse();
    cache.forEach((item, index) => {
      expect(item).toBe(reversed[index]);
      expect(index).toBe(count);
      count++;
    });
  });

  afterEach(() => {
    cache.clear();
  });
});

describe("Cache [TTL] - Time to live expiration", () => {
  const cache = new Cache({ ttl: 10 });

  it("should expire keys", () => {
    // Start time at 0
    mockGlobal<Game>("Game", {
      time: 0
    });

    cache.set("a", 23);
    expect(cache.get("a")).toBe(23);

    // Fast-forward past TTL
    // Start time at 0
    mockGlobal<Game>("Game", {
      time: 50
    });

    expect(cache.get("a")).toBe(undefined);
  });

  afterEach(() => {
    cache.clear();
  });
});
