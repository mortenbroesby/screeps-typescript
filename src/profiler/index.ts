/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable prefer-rest-params */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/unbound-method */
/* eslint-disable @typescript-eslint/restrict-plus-operands */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-types */

import { LRUCache } from "screeps-lru-cache";

let isProfilingEnabled = false;

interface OutputData {
  name: string;
  calls: number;
  cpuPerCall: number;
  callsPerTick: number;
  cpuPerTick: number;
}

export const profilerCache = new LRUCache<string, OutputData>();

export function init(): Profiler {
  const cli: Profiler = {
    isEnabled() {
      return isProfilingEnabled;
    },

    clear() {
      return "Profiler Memory cleared";
    },

    output() {
      if (!isProfilingEnabled) {
        return cli.status();
      }

      return "Done";
    },

    status() {
      if (isProfilingEnabled) {
        return "Profiler is running";
      }

      return "Profiler is stopped";
    },

    start() {
      return "Profiler started";
    },

    stop() {
      if (isProfilingEnabled) {
        isProfilingEnabled = false;
      }

      return "Profiler stopped";
    },

    loop() {
      if (isProfilingEnabled) {
        // Output profiler data
      }
    },

    help(): string {
      return (
        "Profiler.start() - Starts the profiler\n" +
        "Profiler.stop() - Stops/Pauses the profiler\n" +
        "Profiler.status() - Returns whether is profiler is currently running or not\n" +
        "Profiler.output() - Pretty-prints the collected profiler data to the console\n" +
        this.status()
      );
    }
  };

  return cli;
}

export class AlreadyWrappedError {
  public name: string;
  public message: string;
  public stack: string | undefined;

  public constructor() {
    this.name = "AlreadyWrappedError";
    this.message = "Error attempted to double wrap a function.";
    this.stack = new Error().stack;
  }
}

export function isConstructorType(fn: any): boolean {
  try {
    new fn();
  } catch (err) {
    // verify err is the expected error and then
    return false;
  }

  return true;
}

export function Profile(target: Function): void;
export function Profile(target: object, key: string): void;
export function Profile(target: object | Function, key?: string): void {
  if (!PROFILER_ENABLED) {
    return;
  }
}
