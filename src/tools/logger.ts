import { LogLevel } from "../enums/loglevel";

class Logger {
  private logLevel: LogLevel = LogLevel.DEBUG;

  public setLogLevel(targetLevel: LogLevel) {
    this.logLevel = targetLevel;

    console.log("Log-level: ", LogLevel[targetLevel])
  }

  private _log({
    message,
    room,
    logLevel,
    color = '#ffffff'
  }: {
    message: string;
    room?: string;
    logLevel: LogLevel;
    color?: string;
  }) {
    const hasProperLogLevel = logLevel <= this.logLevel;
    if (!hasProperLogLevel) return;

    if (room !== undefined) {
      console.log("<span style='color:" + color + "'><a href='#!/room/" + Game.shard.name + "/" + room + "'>" + room +
        "</a> " + message + "</span>");
    } else {
      console.log("<span style='color:" + color + "'>" + message + "</span>");
    }
  }

  public debug(message: string, room?: string) {
    this._log({ message, room, logLevel: LogLevel.DEBUG, color: '#e3e3e3' });
  }

  public info(message: string, room?: string) {
    this._log({ message, room, logLevel: LogLevel.INFO });
  }

  public warning(message: string, room?: string) {
    this._log({ message, room, logLevel: LogLevel.WARN, color: '#f4c542' });
  }

  public error(message: string, room?: string) {
    this._log({ message, room, logLevel: LogLevel.ERROR, color: '#e50000' });
  }

  public alert(message: string, room?: string) {
    this._log({ message, room, logLevel: LogLevel.ALERT, color: '#ff00d0' });
  }
}

export const logger = new Logger();
