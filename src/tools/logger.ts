import { LogLevel } from "../enums/loglevel";

class Logger {
  private _logLevel: LogLevel = LogLevel.DEBUG;

  public setLogLevel(targetLevel: LogLevel) {
    this._logLevel = targetLevel;

    console.log("Log-level: ", LogLevel[targetLevel]);
  }

  private _log({
    message,
    data,
    logLevel,
    color = "#ffffff"
  }: {
    message: string;
    data: string[];
    logLevel: LogLevel;
    color?: string;
  }) {
    const hasProperLogLevel = logLevel <= this._logLevel;
    if (!hasProperLogLevel) return;

    let combinedMessage = message;

    if (data.length > 0) {
      combinedMessage += JSON.stringify({ ...data });
    }

    console.log(`<span style='color:${color}'>${combinedMessage}</span>`);
  }

  public debug(message: string, ...data: string[]) {
    this._log({ message, data, logLevel: LogLevel.DEBUG, color: "#e3e3e3" });
  }

  public info(message: string, ...data: string[]) {
    this._log({ message, data, logLevel: LogLevel.INFO });
  }

  public warn(message: string, ...data: string[]) {
    this._log({ message, data, logLevel: LogLevel.WARN, color: "#f4c542" });
  }

  public error(message: string, ...data: string[]) {
    this._log({ message, data, logLevel: LogLevel.ERROR, color: "#e50000" });
  }

  public alert(message: string, ...data: string[]) {
    this._log({ message, data, logLevel: LogLevel.ALERT, color: "#ff00d0" });
  }
}

export const logger = new Logger();
