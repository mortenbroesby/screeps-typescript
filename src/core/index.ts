import { Brain } from "../global/brain";
import { Profiler } from "../profiler";
import { setupInitialMemory, setupMemory, shutdownMemory } from "../tools/memory";

import { LogLevel } from "../enums";
import { logger } from "../tools/logger";

export const setupPrerequisites: () => void = () => {
  logger.logLevel = PRODUCTION ? LogLevel.ERROR : LogLevel.DEBUG;

  logger.global("Log-level: ", LogLevel[logger.logLevel]);
};

export const initialiseMainLogic: () => void = () => {
  setupInitialMemory();

  global.Profiler = new Profiler();
  global.Brain = new Brain();
};

export const mainLoopIteration: () => void = () => {
  setupMemory();
  global.Brain?.loop();
  shutdownMemory();
};
