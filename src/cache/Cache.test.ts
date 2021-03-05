import { Cache } from "./Cache";

describe("LRUCache", () => {
  describe("constructor", () => {
    it("should create an instance of LRUCache", () => {
      const cache = new Cache();
      expect(cache).toBeInstanceOf(Cache);
    });
  });
});

describe("Cache [LRU] - Least recently used", () => {
  const cache = new Cache<string, number>({ maxSize: 3 });

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

    expect(cache.get("a")).toBe(null);
  });

  afterEach(() => {
    cache.clear();
  });
});

describe("Cache [Map] - Basic map-like functionality", () => {
  const cache = new Cache<string, number>();

  it("should allow existing keys to be found", () => {
    cache.set("a", 42);
    expect(cache.has("a")).toBe(true);
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
  });

  it("should return undefined for missing keys", () => {
    expect(cache.get("z")).toBe(null);
  });

  it("should allow keys to be deleted", () => {
    cache.set("a", 23);
    expect(cache.delete("a")).toBe(true);
    expect(cache.get("a")).toBe(null);
  });

  it("should return false when deleting non-existent keys", () => {
    expect(cache.delete("a")).toBe(false);
  });

  it("should allow keys to be cleared", () => {
    cache.set("a", 23);
    cache.clear();
    expect(cache.get("a")).toBe(null);
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

  it("should support entries", () => {
    cache.set("a", 40);
    cache.set("b", 41);
    cache.set("c", 42);

    const entries = cache.entries();

    expect(entries.next().value).toStrictEqual({ key: "c", value: 42 });
    expect(entries.next().value).toStrictEqual({ key: "b", value: 41 });
    expect(entries.next().value).toStrictEqual({ key: "a", value: 40 });
  });

  it("should support forEach looping", () => {
    const values: number[] = [1, 2, 3, 4];

    values.forEach(value => {
      cache.set(`${value}`, value);
    });

    let count = 0;
    cache.forEach(() => ++count);
    expect(count).toBe(4);

    count = 0;
    const reversed = values.reverse();
    cache.forEach((item, key, index) => {
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
  const gameInstance = (global.Game = {
    time: 0
  } as Game);

  const cache = new Cache({
    entryExpirationTimeInTicks: 10,
    gameInstance
  });

  it("should expire keys", () => {
    // Start time at 0
    global.Game.time = 0;

    cache.set("a", 23);
    expect(cache.get("a")).toBe(23);

    // Fast-forward past TTL
    global.Game.time = 50;

    expect(cache.get("a")).toBe(null);
  });

  afterEach(() => {
    cache.clear();
  });
});
