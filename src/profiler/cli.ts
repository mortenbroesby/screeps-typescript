import { outputProfilerData } from "./profiler";

export class Profiler {
  private _isEnabled = false;

  public get isEnabled(): boolean {
    return this._isEnabled;
  }
  public set isEnabled(state: boolean) {
    this._isEnabled = state;
  }

  public start(): string {
    this.isEnabled = true;
    return "Profiler started";
  }

  public stop(): string {
    this.isEnabled = false;
    return "Profiler stopped";
  }

  public status(): string {
    if (this.isEnabled) {
      return "Profiler is running";
    }

    return "Profiler is stopped";
  }

  public output(): string {
    if (!this.isEnabled) {
      return this.status();
    }

    return outputProfilerData();
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
