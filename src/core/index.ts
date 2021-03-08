import { Brain } from "../brain";
import { setupInitialMemory, setupMemory, shutdownMemory } from "../tools/memory";

import Constants from "../config/constants";

import { LogLevel } from "../enums";
import { logger } from "../tools/logger";
import { ErrorMapper } from "../utils/ErrorMapper";

/**
 * Setup pre-requisites before intialisation
 */
const setupPrerequisites: () => void = () => {
  logger.logLevel = Constants.isProduction ? LogLevel.ERROR : LogLevel.DEBUG;

  logger.global("Log-level: ", LogLevel[logger.logLevel]);

  if (Date.now() - JSON.parse(BUILD_DATE) < 15000) {
    // Built less than 15 seconds ago - fresh code push
    logger.global(`New code successfully deployed, build time: ${new Date(JSON.parse(BUILD_DATE))}`);
  } else {
    logger.global("Global reset detected.");
  }

  setupInitialMemory();
};

/**
 * Expose project initialisation
 */
export const initialiseMainLogic: () => void = () => {
  setupPrerequisites();

  global.Brain = new Brain();
  global.Brain.initialise();
};

/**
 * Expose project logic loop
 */
const mainLoop: () => void = () => {
  setupMemory();

  global.Brain.loop();
  global.Brain.cleanup();

  shutdownMemory();
};

/**
 * Use main loop if targeting production
 */
let exportedLoop = mainLoop;

/**
 * Wrap loop in ErrorMapper if targeting development
 */
if (!Constants.isProduction) {
  exportedLoop = ErrorMapper.wrapLoop(mainLoop);
}

export const mainLoopIteration = exportedLoop;
