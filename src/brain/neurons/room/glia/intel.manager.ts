import { logger } from "../../../../tools/logger";
import { RoomNeuron, Glia } from "../room.neuron";

interface CreepCollection {
  [role: string]: Creep[];
}

export class IntelManager implements Glia {
  private _creepCollection: CreepCollection = {};

  private _currentRoom: Room;

  public get currentRoom(): Room {
    return this._currentRoom;
  }

  public constructor(public brain: RoomNeuron, room: Room) {
    brain.register(this, this.constructor.name);
    this._currentRoom = room;
  }

  public initialise(): void {
    this._creepCollection = this._createCollection();
    // console.log(JSON.stringify(this.creepCollection))
  }

  public get collection(): CreepCollection {
    return this._creepCollection;
  }

  private _createCollection(): CreepCollection {
    const collection: CreepCollection = {};

    for (const name in Game.creeps) {
      const creep = Game.creeps[name];

      const creepRole: CreepRole = creep.memory.role ?? "unassigned";

      if (creepRole === "unassigned") {
        logger.warn(`Creep with unknown role: ${creep.name} Pos: ${creep.pos.roomName}`);
        logger.warn("Removing creep from game...");

        creep.suicide();
      }

      if (collection[creepRole] === undefined) {
        collection[creepRole] = [creep];
      } else {
        collection[creepRole].push(creep);
      }
    }

    return collection;
  }

  public loop(): void {
    // Do nothing for now
  }

  public log(): void {
    // Do nothing for now
  }

  public cleanup(): void {
    // Do nothing for now
  }
}
