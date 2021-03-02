import Constants from "global/constants";
import { defaultSettings } from "config/settings";

import { logger } from "tools/logger";
import { Service } from "./abstract";
import { defaultCreepMemory } from "config/creep";

export class GlobalMemoryService extends Service {
  public constructor() {
    super({ name: GlobalMemoryService.name });

    console.log(`Brain version: ${Constants.VERSION}`);

    const settingsMemory: MemorySettings | undefined = Memory.settings;
    const settingsVersion: string = settingsMemory?.version ?? "-1";

    const shouldResetMemory = settingsVersion !== defaultSettings.version;
    if (shouldResetMemory) {
      console.log(`Re-setting memory settings: ${JSON.stringify(defaultSettings)}`);
      Memory.settings = defaultSettings;
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
      } else {
        const creepMemory: CreepMemory = Memory.creeps[name];
        const memoryVersion = creepMemory.version ?? "-1";

        console.log("memoryVersion", memoryVersion);

        if (memoryVersion !== defaultCreepMemory.version) {
          // const actualCreep = Game.creeps[name];
          // logger.debug(`Removing creep with old memory: ${actualCreep.name}`);
          // actualCreep.suicide();

          logger.warn(`[WARN]: Creep has outdated memory: ${name}`);
        }
      }
    }
  }
}
