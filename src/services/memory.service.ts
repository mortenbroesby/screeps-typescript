import { defaultCreepMemory } from "../config/creep";
import { defaultSettings } from "../config/settings";
import Constants from "../global/constants";
import { Profile } from "../profiler";
import { logger } from "../tools/logger";

import { Service } from "./abstract.service";

@Profile
export class MemoryService extends Service {
  public constructor() {
    super({ name: MemoryService.name });

    logger.global(`Brain version: ${Constants.VERSION}`);
  }

  public loop(): void {
    this._resetStaleMemory();

    Object.entries(Memory.creeps).forEach(([creepName, creepMemory]) => {
      this._checkCreepMemoryVersion(creepName, creepMemory);
      this._cleanupStaleCreepMemory(creepName);
    });
  }

  // Warn if creep has outdated memory
  private _checkCreepMemoryVersion(creepName: string, memory: CreepMemory) {
    const memoryVersion = memory.version ?? "-1";

    if (memoryVersion !== defaultCreepMemory().version) {
      logger.warn(`Creep has outdated memory: ${creepName}`);
    }
  }

  private _cleanupStaleCreepMemory(creepName: string): void {
    const matchingCreep: Creep | undefined = Game.creeps[creepName];
    if (!matchingCreep) {
      logger.debug(`Clearing non-existing creep memory: ${creepName}`);
      delete Memory.creeps[creepName];
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
