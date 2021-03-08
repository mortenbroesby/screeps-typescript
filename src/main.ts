import "./polyfills";
import { ErrorMapper } from "./utils/ErrorMapper";

import { setupPrerequisites, initialiseMainLogic, mainLoopIteration } from "./core";

/**
 * Setup variables before initialisation
 */
setupPrerequisites();

/**
 * Initialise project logic
 */
initialiseMainLogic();

/**
 * Perform logic loop
 */
export const loop = ErrorMapper.wrapLoop(mainLoopIteration);
