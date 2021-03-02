import Config from "config";

import { LogLevel } from "enums";
import { Service } from "services/abstract";
import { RoomService } from "services/room";
import { logger } from "tools/logger";

import { Manager } from "../managers/abstract";
import { CreepManager } from "../managers/creep";
import { DebugManager } from "../managers/debug";
import { MemoryManager } from "../managers/memory";

export class Brain {
  private services: Service[] = [];
  private managers: Manager[] = [];

  public get version(): string {
    return "1.0.5";
  }

  public constructor() {
    this.initialise();
  }

  private initialise(): void {
    const logLevel = PRODUCTION ? LogLevel.ERROR : LogLevel.DEBUG;

    logger.setLogLevel(logLevel);

    Memory.settings = {
      ...Config.settings,
      version: this.version
    };

    console.log(`Brain version: ${this.version}`);

    // Initialise all services
    this.services = [new RoomService()];

    // Initialise all managers
    this.managers = [new DebugManager(), new CreepManager(), new MemoryManager()];
  }

  public loop(): void {
    // logger.debug("Brain is looping.");

    this.services.forEach((service: Service) => {
      service.loop();
    });

    this.managers.forEach((manager: Manager) => {
      manager.loop();
    });
  }
}
