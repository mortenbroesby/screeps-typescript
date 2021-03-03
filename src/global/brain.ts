import { setupInitialMemory, setupMemory, shutdownMemory } from "tools/memory";

import { Service } from "services/abstract.service";
import { RoomService } from "services/room.service";
import { DebugService } from "../services/debug.service";
import { MemoryService } from "../services/memory.service";

export class Brain {
  private _services: Service[] = [];

  public constructor() {
    setupInitialMemory();

    this._initialise();
  }

  private _initialise(): void {
    this._services = [new DebugService(), new MemoryService(), new RoomService()];
  }

  public loop(): void {
    setupMemory();

    this._services.forEach((service: Service) => {
      service.loop();
    });

    shutdownMemory();
  }
}
