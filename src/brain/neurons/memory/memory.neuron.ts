import Constants from "../../../config/constants";

import { logger } from "../../../tools/logger";
import { Brain, Neuron } from "../..";
import { defaultSettings } from "../../../config/settings";

export class MemoryService implements Neuron {
  public constructor(public brain: Brain) {
    brain.register(this, this.constructor.name);
  }

  public initialise(): void {
    logger.global(`Brain version: ${Constants.version}`);
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

  public log(): void {
    // Do nothing for now
  }
}
