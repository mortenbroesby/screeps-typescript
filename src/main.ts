import { ErrorMapper } from "utils/ErrorMapper";

import { LogLevel } from "enums";
import { logger } from "tools/logger";

import { Brain } from "global/brain";

logger.logLevel = LOG_LEVEL ?? LogLevel.ERROR;

logger.global("Log-level: ", LogLevel[logger.logLevel]);

// Initialise main brain
const mainBrain = new Brain();

export const loop = ErrorMapper.wrapLoop(() => {
  mainBrain.loop(); // Loop main brain
});
