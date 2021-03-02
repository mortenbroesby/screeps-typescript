import { LogLevel } from "enums/loglevel";

export interface LogConfig {
  default: LogLevel;
}

export const logLevel: LogConfig = {
  default: LogLevel.INFO
};
