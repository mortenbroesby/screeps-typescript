import { initialiseMainLogic, mainLoopIteration } from "./core";

/**
 * Initialise project logic
 */
initialiseMainLogic();

/**
 * Perform logic loop
 */
export const loop = mainLoopIteration;
