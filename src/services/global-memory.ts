import { logger } from "tools/logger";

import Constants from "global/constants";

import { defaultCreepMemory } from "config/creep";
import { defaultSettings } from "config/settings";
import { Service } from "./abstract";

export class GlobalMemoryService extends Service {
  public constructor() {
    super({ name: GlobalMemoryService.name });

    logger.global(`Brain version: ${Constants.VERSION}`);

    const settingsMemory: MemorySettings | undefined = Memory.settings;
    const settingsVersion: string = settingsMemory?.version ?? "-1";

    const shouldResetMemory = settingsVersion !== defaultSettings.version;
    if (shouldResetMemory) {
      logger.info(`Re-setting memory settings: ${JSON.stringify(defaultSettings)}`);
      Memory.settings = defaultSettings;
    }

    // Automatically delete memory of missing creeps
    for (const name in Memory.creeps) {
      const creepMemory: CreepMemory = Memory.creeps[name];
      const memoryVersion = creepMemory.version ?? "-1";

      if (memoryVersion !== defaultCreepMemory.version) {
        logger.warn(`Creep has outdated memory: ${name}`);
      }
    }
  }

  /**
   * Game loop.
   */
  public loop(): void {
    // Automatically delete memory of missing creeps
    for (const name in Memory.creeps) {
      if (!(name in Game.creeps)) {
        delete Memory.creeps[name];

        logger.debug(`Clearing non-existing creep memory: ${name}`);
      }
    }
  }
}
