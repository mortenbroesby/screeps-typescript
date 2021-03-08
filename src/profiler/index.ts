import { LRUCache } from "screeps-lru-cache";

interface OutputData {
  name: string;
  calls: number;
  cpuPerCall: number;
  callsPerTick: number;
  cpuPerTick: number;
}

export const profilerCache = new LRUCache<string, OutputData>();

export class Profiler {
  private _isProfilingEnabled = false;

  public isEnabled(): boolean {
    return this._isProfilingEnabled;
  }

  public clear(): string {
    return "Profiler Memory cleared";
  }

  public status(): string {
    if (this._isProfilingEnabled) {
      return "Profiler is running";
    }

    return "Profiler is stopped";
  }

  public start(): string {
    return "Profiler started";
  }

  public stop(): string {
    this._isProfilingEnabled = false;
    return "Profiler stopped";
  }

  public loop(): void {
    if (this._isProfilingEnabled) {
      // Output profiler data
    }
  }

  public help(): string {
    let helpMessage = "";

    helpMessage += "Profiler.start() - Starts the profiler\n";
    helpMessage += "Profiler.stop() - Stops/Pauses the profiler\n";
    helpMessage += "Profiler.status() - Returns whether is profiler is currently running or not\n";
    helpMessage += "Profiler.output() - Pretty-prints the collected profiler data to the console\n";

    return helpMessage;
  }
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
