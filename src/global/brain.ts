import { LogLevel } from "enums";
import { Service } from "services/abstract";
import { RoomService } from "services/room";
import { logger } from "tools/logger";

import { DebugService } from "../services/debug";
import { GlobalMemoryService } from "../services/global-memory";

export class Brain {
  private _services: Service[] = [];

  public constructor() {
    this._initialise();
  }

  private _initialise(): void {
    const logLevel = PRODUCTION ? LogLevel.ERROR : LogLevel.DEBUG;

    logger.setLogLevel(logLevel);

    // Initialise all services
    this._services = [new DebugService(), new RoomService(), new GlobalMemoryService()];
  }

  public loop(): void {
    // logger.debug("Brain is looping.");

    this._services.forEach((service: Service) => {
      service.loop();
    });
  }
}
