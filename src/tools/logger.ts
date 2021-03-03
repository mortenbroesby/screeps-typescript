import { LogLevel } from "../enums";
import { convertToString } from "./utils";

class Logger {
  private _logLevel: LogLevel = LogLevel.DEBUG;

  public get logLevel(): LogLevel {
    return this._logLevel;
  }
  public set logLevel(level: LogLevel) {
    this._logLevel = level;
  }

  private _log({
    message,
    args,
    logLevel,
    color = "#ffffff"
  }: {
    message: string;
    args: unknown[];
    logLevel: LogLevel;
    color?: string;
  }) {
    const hasProperLogLevel = logLevel <= this._logLevel;
    if (!hasProperLogLevel) return;

    let displayedMessage = LogLevel[logLevel].toLowerCase();

    displayedMessage += ` ${message}`;
    displayedMessage += convertToString(args);

    console.log(`<span style='color:${color}'>${displayedMessage}</span>`);
  }

  public global(message: string, ...args: unknown[]) {
    this._log({ message, args, logLevel: LogLevel.GLOBAL });
  }

  public debug(message: string, ...args: unknown[]) {
    this._log({ message, args, logLevel: LogLevel.DEBUG, color: "#e3e3e3" });
  }

  public info(message: string, ...args: unknown[]) {
    this._log({ message, args, logLevel: LogLevel.INFO });
  }

  public warn(message: string, ...args: unknown[]) {
    this._log({ message, args, logLevel: LogLevel.WARN, color: "#f4c542" });
  }

  public error(message: string, ...args: unknown[]) {
    this._log({ message, args, logLevel: LogLevel.ERROR, color: "#e50000" });
  }

  public alert(message: string, ...args: unknown[]) {
    this._log({ message, args, logLevel: LogLevel.ALERT, color: "#ff00d0" });
  }
}

export const logger = new Logger();
