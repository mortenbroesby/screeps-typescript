import { defaultSettings } from "../config/settings";
import Constants from "../global/constants";
import { logger } from "../tools/logger";

import { Service } from "./abstract.service";

export class MemoryService extends Service {
  public initialise(): void {
    logger.global(`Brain version: ${Constants.VERSION}`);
  }

  public loop(): void {
    this._resetStaleMemory();

    Object.entries(Memory.creeps).forEach(([creepName]) => {
      this._cleanupStaleCreepMemory(creepName);
    });
  }

  public cleanup(): void {
    // Do nothing for now
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
