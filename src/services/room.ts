import { Service } from "./abstract";

import { Manager } from "services/managers/abstract";
import { CreepManager } from "services/managers/creep";

interface RoomCollection {
  [roomName: string]: Manager[];
}

export class RoomService extends Service {
  private _roomManagers: RoomCollection = {};

  public constructor() {
    super({ name: RoomService.name });

    Object.values(Game.rooms).forEach((room: Room) => {
      if (this._roomManagers[room.name] === undefined) {
        this._roomManagers[room.name] = [];
      }

      this._roomManagers[room.name] = [new CreepManager(room)];
    });
  }

  /**
   * Game loop.
   */
  public loop(): void {
    // logger.debug("RoomService is looping");

    Object.values(this._roomManagers).forEach((managers: Manager[]) => {
      managers.forEach((manager: Manager) => {
        manager.loop();
      });
    });
  }
}
