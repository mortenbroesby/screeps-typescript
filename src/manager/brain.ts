import Config from "config";
import { LogLevel } from "enums";

import { logger } from "tools/logger";
import { Manager } from "./abstract";

import { CreepManager } from "./creep";
import { DebugManager } from "./debug";
import { MemoryManager } from "./memory";
import { RoomManager } from "./room";

export class Brain {
  private managers: Manager[] = [];

  constructor() {
    this.setDefaults();
    this.initialiseManagers();
  }

  get version(): string {
    return `1.0.1`;
  }

  private setDefaults(): void {
    const logLevel = PRODUCTION ? LogLevel.ERROR : LogLevel.INFO;

    logger.setLogLevel(logLevel)

    Memory.settings = {
      ...Config.settings,
      version: this.version
    };

    logger.info(`Brain version: ${this.version}`)
  }

  private initialiseManagers(): void {
    this.managers = [
      new DebugManager(),
      new CreepManager(),
      new MemoryManager(),
      new RoomManager(),
    ];
  }

  public loop(): void {
    logger.debug("Brain is looping.");

    this.managers.forEach((manager) => {
      logger.debug(`Looping manager: ${manager.settings.name}`);

      manager.loop();
    })
  }
}
