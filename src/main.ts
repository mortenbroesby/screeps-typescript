import { LogLevel } from "enums";
import { Brain } from "global/brain";
import { logger } from "tools/logger";
// import { setupMemory, shutdownMemory } from "tools/memory";
import { ErrorMapper } from "utils/ErrorMapper";

import * as Profiler from "./profiler";

global.Profiler = Profiler.init();

logger.logLevel = LOG_LEVEL ?? LogLevel.ERROR;

logger.global("Log-level: ", LogLevel[logger.logLevel]);

// Initialise main brain
const mainBrain = new Brain();

export const loop = ErrorMapper.wrapLoop(() => {
  // setupMemory();
  mainBrain.loop();
  // shutdownMemory();
});
