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
      let helpMessage = "";

      helpMessage += "Profiler.start() - Starts the profiler\n";
      helpMessage += "Profiler.stop() - Stops/Pauses the profiler\n";
      helpMessage += "Profiler.status() - Returns whether is profiler is currently running or not\n";
      helpMessage += "Profiler.output() - Pretty-prints the collected profiler data to the console\n";

      return helpMessage;
    }
  };

  return cli;
}

export function Profile(target: Function): void;
export function Profile(target: object, key: string): void;
export function Profile(target: object | Function, key?: string): void {
  if (!PROFILER_ENABLED) {
    return;
  }

  if (!target) {
    return;
  }

  if (!key) {
    return;
  }
}
