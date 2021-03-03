import { logger } from "tools/logger";

import Constants from "global/constants";

import { defaultCreepMemory } from "config/creep";
import { defaultSettings } from "config/settings";
import { Service } from "./abstract.service";

export class MemoryService extends Service {
  public constructor() {
    super({ name: MemoryService.name });

    logger.global(`Brain version: ${Constants.VERSION}`);
  }

  public loop(): void {
    this._cleanupOutdatedCreepMemory();
    this._cleanupStaleCreepMemory();

    this._resetStaleMemory();
  }

  private _cleanupOutdatedCreepMemory(): void {
    // Warn if creep has outdated memory
    for (const name in Memory.creeps) {
      const creepMemory: CreepMemory = Memory.creeps[name];
      const memoryVersion = creepMemory.version ?? "-1";

      if (memoryVersion !== defaultCreepMemory().version) {
        logger.warn(`Creep has outdated memory: ${name}`);
      }
    }
  }

  private _cleanupStaleCreepMemory(): void {
    // Automatically delete memory of missing creeps
    for (const name in Memory.creeps) {
      if (!(name in Game.creeps)) {
        delete Memory.creeps[name];

        logger.debug(`Clearing non-existing creep memory: ${name}`);
      }
    }
  }

  private _resetStaleMemory(): void {
    const settingsMemory: MemorySettings | undefined = Memory.settings;
    const settingsVersion: string = settingsMemory?.version ?? "-1";

    const shouldResetMemory = settingsVersion !== defaultSettings().version;
    if (shouldResetMemory) {
      logger.debug(`Re-setting memory settings: ${JSON.stringify(defaultSettings())}`);

      Memory.settings = defaultSettings();
    }
  }
}
