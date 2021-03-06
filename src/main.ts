import { LogLevel } from "./enums";
import { Brain } from "./global/brain";
import { logger } from "./tools/logger";
import { setupInitialMemory, setupMemory, shutdownMemory } from "./tools/memory";
import { ErrorMapper } from "./utils/ErrorMapper";

setupInitialMemory();

import { init } from "./profiler";
global.Profiler = init();

logger.logLevel = LOG_LEVEL ?? LogLevel.ERROR;

logger.global("Log-level: ", LogLevel[logger.logLevel]);

// Initialise main brain
const mainBrain = new Brain();

export const loop = ErrorMapper.wrapLoop(() => {
  setupMemory();
  mainBrain.loop();
  shutdownMemory();
});
