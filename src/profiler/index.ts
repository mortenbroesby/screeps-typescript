export class Profiler {
  private _isEnabled = false;

  public start(): string {
    this._isEnabled = true;
    return "Profiler started";
  }

  public stop(): string {
    this._isEnabled = false;
    return "Profiler stopped";
  }

  public status(): string {
    if (this._isEnabled) {
      return "Profiler is running";
    }

    return "Profiler is stopped";
  }

  public output(): string {
    if (!this._isEnabled) {
      return this.status();
    }

    return "Profiler output not implemented yet";
  }

  public help(): string {
    let helpMessage = "";

    helpMessage += "Profiler.start() - Starts the profiler \n";
    helpMessage += "Profiler.stop() - Stops/Pauses the profiler \n";
    helpMessage += "Profiler.status() - Returns whether is profiler is currently running or not \n";
    helpMessage += "Profiler.output() - Pretty-prints the collected profiler data to the console \n";

    return helpMessage;
  }
}

export interface OutputData {
  name: string;
  calls: number;
  cpuPerCall: number;
  callsPerTick: number;
  cpuPerTick: number;
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
