import { Brain } from "../global/brain";
import { Profiler } from "../profiler";
import { setupInitialMemory, setupMemory, shutdownMemory } from "../tools/memory";

import { LogLevel } from "../enums";
import { logger } from "../tools/logger";

/**
 * Setup pre-requisites before intialisation
 */
const setupPrerequisites: () => void = () => {
  logger.logLevel = IS_PRODUCTION ? LogLevel.ERROR : LogLevel.DEBUG;

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

  global.Profiler = new Profiler();
  global.Brain = new Brain();

  global.Brain.initialise();
};

/**
 * Expose project logic loop
 */
export const mainLoopIteration: () => void = () => {
  setupMemory();

  global.Brain.loop();
  global.Brain.cleanup();

  shutdownMemory();
};
