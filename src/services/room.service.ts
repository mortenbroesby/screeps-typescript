import { Service } from "./abstract.service";

import { Manager } from "services/room/managers/abstract.manager";
import { CreepManager } from "services/room/managers/creep.manager";

interface RoomCollection {
  [roomName: string]: Manager[];
}

export class RoomService extends Service {
  private _roomManagers: RoomCollection = {};

  public constructor() {
    super({ name: RoomService.name });

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
}