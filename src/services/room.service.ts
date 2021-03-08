import { Manager } from "../services/room/managers/abstract.manager";
import { CreepManager } from "../services/room/managers/creep.manager";

import { Service } from "./abstract.service";

interface RoomCollection {
  [roomName: string]: Manager[];
}

export class RoomService extends Service {
  private _roomManagers: RoomCollection = {};

  public initialise(): void {
    Object.values(Game.rooms).forEach((room: Room) => {
      this._roomManagers[room.name] = [new CreepManager(room)];
    });
  }

  public loop(): void {
    Object.values(this._roomManagers).forEach((managers: Manager[]) => {
      managers.forEach((manager: Manager) => {
        manager.loop();
      });
    });
  }

  public cleanup(): void {
    // Do nothing for now
  }
}
