import { Service } from "../services/abstract.service";
import { RoomService } from "../services/room.service";
import { DebugService } from "../services/debug.service";
import { MemoryService } from "../services/memory.service";

export class Brain {
  private _managers: Map<string, Service> = new Map();

  public constructor() {
    new DebugService(this);
    new MemoryService(this);
    new RoomService(this);
  }

  /**
   * Register a new Service with lifecycle functions
   * Note: This is called automatically by the constructor for each Service
   */
  public register(manager: Service): void {
    this._managers.set(manager.constructor.name, manager);
  }

  /**
   * Initialise all services
   * Note: Invoked every global reset
   */
  public initialise(): void {
    this._managers.forEach(manager => {
      manager.initialise();
    });
  }

  /**
   * Perform logic loop
   * Note: Invoked every tick.
   */
  public loop(): void {
    this._managers.forEach(manager => {
      manager.loop();
    });
  }

  /**
   * Cleanup after logic loop
   * Note: Invoked every tick.
   */
  public cleanup(): void {
    this._managers.forEach(manager => {
      manager.cleanup();
    });
  }
}
