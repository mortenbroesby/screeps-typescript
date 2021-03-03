import { ErrorMapper } from "utils/ErrorMapper";

import { LogLevel } from "enums";
import { logger } from "tools/logger";

import { Brain } from "global/brain";

const logLevel = PRODUCTION ? LogLevel.ERROR : LogLevel.DEBUG;

logger.setLogLevel(logLevel);

// Initialise main brain
const mainBrain = new Brain();

export const loop = ErrorMapper.wrapLoop(() => {
  mainBrain.loop(); // Loop main brain
});
