import { logger } from "tools/logger";
import { Service } from "./abstract";

export class GlobalMemoryService extends Service {
  public constructor() {
    super({ name: GlobalMemoryService.name });
  }

  /**
   * Game loop.
   */
  public loop(): void {
    // Automatically delete memory of missing creeps
    for (const name in Memory.creeps) {
      if (!(name in Game.creeps)) {
        delete Memory.creeps[name];

        logger.debug("Clearing non-existing creep memory:", name);
      }
    }
  }
}
