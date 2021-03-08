import _ from "lodash";

export interface OutputData {
  name: string;
  calls: number;
  cpuPerCall: number;
  callsPerTick: number;
  cpuPerTick: number;
}

interface ProfilerData {
  calls: number;
  time: number;
}

import { LRUCache } from "screeps-lru-cache";

export const profilerCache = new LRUCache<string, ProfilerData>();

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ProfileTarget = any;

export function Profile(target: Function): void;
export function Profile(target: object, key: string): void;
export function Profile(target: object | Function, key?: string): void {
  if (!PROFILER_ENABLED) {
    return;
  }

  if (key) {
    // Case of method decorator
    wrapFunction(target, key);
    return;
  }

  // Case of class decorator
  const ctor = target as ProfileTarget;
  if (!ctor.prototype) {
    return;
  }

  Reflect.ownKeys(ctor.prototype).forEach(reflectedKey => {
    wrapFunction(ctor.prototype, reflectedKey as string, ctor.name);
  });
}

export function wrapFunction(target: object, key: string, className?: string): void {
  const descriptor = Reflect.getOwnPropertyDescriptor(target, key);
  if (!descriptor || descriptor.get || descriptor.set) {
    return;
  }

  if (key === "constructor") {
    return;
  }

  const originalFunction = descriptor.value;
  if (!originalFunction || typeof originalFunction !== "function") {
    return;
  }

  // Set a key for the object in memory
  if (!className) {
    className = target.constructor ? `${target.constructor.name}` : "";
  }

  const memKey = className + `:${key}`;

  // Set a tag so we don't wrap a function twice
  const savedName = `__${key}__`;
  if (Reflect.has(target, savedName)) {
    return;
  }

  Reflect.set(target, savedName, originalFunction);

  Reflect.set(target, key, function (this: ProfileTarget, ...args: ProfileTarget[]) {
    if (global.Profiler?.isEnabled) {
      const start = Game.cpu.getUsed();
      const result = originalFunction.apply(this, args);
      const end = Game.cpu.getUsed();
      record(memKey, end - start);
      return result;
    }

    return originalFunction.apply(this, args);
  });
}

function record(key: string, time: number) {
  const profileItem: ProfilerData = profilerCache.get(key) || {
    calls: 0,
    time: 0
  };

  profileItem.calls++;
  profileItem.time += time;

  profilerCache.set(key, profileItem);
}

export function outputProfilerData(): string {
  const totalTicks = Game.time;

  let totalCpu = 0;
  const calls = 0;
  const time = 0;
  let result: OutputData;

  const data = Reflect.ownKeys(profilerCache).map(key => {
    result = {
      name: `${key as string}`,
      calls,
      cpuPerCall: time / calls,
      callsPerTick: calls / totalTicks,
      cpuPerTick: time / totalTicks
    };

    totalCpu += result.cpuPerTick;

    return result;
  });

  data.sort((lhs, rhs) => rhs.cpuPerTick - lhs.cpuPerTick);

  // Format data
  let output = "";

  output += _.pad("Total Calls", 12);
  output += _.pad("CPU/Call", 12);
  output += _.pad("Calls/Tick", 12);
  output += _.pad("CPU/Tick", 12);
  output += _.pad("% of Tot\n", 12);

  data.forEach(item => {
    output += _.pad(`${item.calls}`, 12);
    output += _.pad(`${item.cpuPerCall.toFixed(2)}ms`, 12);
    output += _.pad(`${item.callsPerTick.toFixed(2)}`, 12);
    output += _.pad(`${item.cpuPerTick.toFixed(2)}ms`, 12);
    output += _.pad(`${((item.cpuPerTick / totalCpu) * 100).toFixed(0)} %\n`, 12);
  });

  // // Footer line
  output += `${totalTicks} total ticks measured`;
  output += `\t\t\t${totalCpu.toFixed(2)} average CPU profiled per tick`;

  return output;
}
