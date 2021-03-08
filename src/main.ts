import "./polyfills";
import { ErrorMapper } from "./utils/ErrorMapper";

import { initialiseMainLogic, mainLoopIteration } from "./core";

/**
 * Initialise project logic
 */
initialiseMainLogic();

/**
 * Perform logic loop
 */
export const loop = ErrorMapper.wrapLoop(mainLoopIteration);
