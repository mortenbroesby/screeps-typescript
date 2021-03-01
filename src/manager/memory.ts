import { ManagerPriority } from "enums";
import { logger } from "tools/logger";
import { Manager } from "./abstract";

export class MemoryManager extends Manager {
  public constructor() {
    super({
      name: MemoryManager.name,
      priority: ManagerPriority.Critical
    });
  }

  /**
   * Game loop.
   */
  public loop(): void {
    // Automatically delete memory of missing creeps
    for (const name in Memory.creeps) {
      if (!(name in Game.creeps)) {
        delete Memory.creeps[name];

        logger.debug('Clearing non-existing creep memory:', name);
      }
    }
  }
}
