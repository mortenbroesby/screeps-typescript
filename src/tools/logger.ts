import { LogLevel } from "../enums";

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
    data: unknown[];
    logLevel: LogLevel;
    color?: string;
  }) {
    const logLevelString = LogLevel[logLevel].toLowerCase();

    const hasProperLogLevel = logLevel <= this._logLevel;
    if (!hasProperLogLevel) return;

    let displayedMessage = `[${logLevelString}] ${message}`;

    if (data.length > 0) {
      const argumentValues: string = data.reduce((accumulated: string, value) => {
        if (typeof value === "string") {
          return `${accumulated} ${value}`;
        }

        const serialised = JSON.stringify(value)
          .replace(/:(\d+)([,}])/g, ':"$1"$2')
          .replace(/:(true|false|null)/g, ':"$1"');

        return `${accumulated} ${serialised}`;
      }, "");

      displayedMessage += argumentValues;
    }

    console.log(`<span style='color:${color}'>${displayedMessage}</span>`);
  }

  public global(message: string, ...data: unknown[]) {
    this._log({ message, data, logLevel: LogLevel.GLOBAL });
  }

  public debug(message: string, ...data: unknown[]) {
    this._log({ message, data, logLevel: LogLevel.DEBUG, color: "#e3e3e3" });
  }

  public info(message: string, ...data: unknown[]) {
    this._log({ message, data, logLevel: LogLevel.INFO });
  }

  public warn(message: string, ...data: unknown[]) {
    this._log({ message, data, logLevel: LogLevel.WARN, color: "#f4c542" });
  }

  public error(message: string, ...data: unknown[]) {
    this._log({ message, data, logLevel: LogLevel.ERROR, color: "#e50000" });
  }

  public alert(message: string, ...data: unknown[]) {
    this._log({ message, data, logLevel: LogLevel.ALERT, color: "#ff00d0" });
  }
}

export const logger = new Logger();
