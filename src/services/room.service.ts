import ScreepsCache from "screeps-lru-cache";

import { Manager } from "services/room/managers/abstract.manager";
import { CreepManager } from "services/room/managers/creep.manager";

import { Service } from "./abstract.service";

interface RoomCollection {
  [roomName: string]: Manager[];
}

export class RoomService extends Service {
  private _roomManagers: RoomCollection = {};
  private _cache = new ScreepsCache<string, Room>();

  public constructor() {
    super({ name: RoomService.name });

    Object.values(Game.rooms).forEach((room: Room) => {
      this._cache.set(room.name, room);

      this._roomManagers[room.name] = [new CreepManager(room)];
    });
  }

  public loop(): void {
    this._cache.forEach((room: Room) => {
      console.log(`cached room: ${room.name}`, room);
    });

    Object.values(this._roomManagers).forEach((managers: Manager[]) => {
      managers.forEach((manager: Manager) => {
        manager.loop();
      });
    });
  }
}
