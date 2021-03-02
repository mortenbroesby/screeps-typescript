import { BaseRole } from "roles/abstract";
import { UpgraderRole } from "roles/upgrader";
import { logger } from "tools/logger";
import { executeAction } from "tools/utils";

import { BuilderRole } from "../../roles/builder";
import { HarvesterRole } from "../../roles/harvester";
import { Manager } from "./abstract";

interface CreepCollection {
  [role: string]: Creep[];
}

export class CreepManager extends Manager {
  private _creepCollection: CreepCollection = {};

  private _currentRoom: Room;

  public get currentRoom(): Room {
    return this._currentRoom;
  }

  public constructor(room: Room) {
    super({ name: CreepManager.name });

    this._currentRoom = room;

    this._creepCollection = this._createCollection();
    // console.log(JSON.stringify(this.creepCollection))
  }

  public get collection(): CreepCollection {
    return this._creepCollection;
  }

  public get spawn(): StructureSpawn | undefined {
    const allSpawnsInRoom = this._currentRoom.find(FIND_MY_STRUCTURES, {
      filter: structure => structure.structureType === STRUCTURE_SPAWN
    }) as StructureSpawn[];

    const firstSpawnInRoom = allSpawnsInRoom[0];
    return firstSpawnInRoom;
  }

  private _createCollection(): CreepCollection {
    const collection: CreepCollection = {};

    for (const name in Game.creeps) {
      const creep = Game.creeps[name];

      const creepRole: Role = creep.memory.role ?? "Unassigned";

      if (creepRole === "Unassigned") {
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

  /**
   * Game loop.
   */
  public loop(): void {
    const creepsInRoom = this.currentRoom.find(FIND_MY_CREEPS);

    this._trySpawningCreeps(creepsInRoom);
    this._tryAssigningRoles(creepsInRoom);
  }

  private _trySpawningCreeps(creeps: Creep[]): void {
    if (this.spawn === undefined) {
      return logger.info(`[No spawn] Skipping spawning: ${this.currentRoom.name}`);
    }

    if (this.spawn.spawning) {
      const spawningCreep = Game.creeps[this.spawn.spawning.name];

      this.spawn.room.visual.text(`🛠️${spawningCreep.memory.role}`, this.spawn.pos.x + 1, this.spawn.pos.y, {
        align: "left",
        opacity: 0.8
      });

      return logger.info(`[Spawning] Is already spawning: ${this.currentRoom.name}`);
    }

    const harvesters = _.filter(creeps, creep => creep.memory.role === "Harvester");

    logger.info(`Harvesters: ${harvesters.length}`);

    if (harvesters.length < 2) {
      const creepName = `Harvester${Game.time}`;

      const didSpawnCreep = this.spawn.spawnCreep([WORK, CARRY, MOVE], creepName);
      if (didSpawnCreep === OK) {
        logger.info("Spawned new harvester: " + creepName);
      }
    }
  }

  private _tryAssigningRoles(creeps: Creep[]): void {
    creeps.forEach((creep: Creep) => {
      this._tryAssigningRole(creep);
    });
  }

  private _tryAssigningRole(creep: Creep): void {
    const creepRole: Role = creep.memory.role ?? "Unassigned";

    type RoleFunction = () => BaseRole;
    type RoleAssignment = RoleFunction | undefined;

    type RoleMap = {
      [key in Role]: RoleAssignment;
    };

    const roleMap: RoleMap = {
      Harvester: () => new HarvesterRole(creep, this.currentRoom),
      Builder: () => new BuilderRole(creep, this.currentRoom),
      Upgrader: () => new UpgraderRole(creep, this.currentRoom),

      // Do nothing for unassigned roles
      Unassigned: undefined
    };

    const didExecute = executeAction(roleMap[creepRole]);
    if (!didExecute) {
      logger.info(`Creep is missing role: ${creep.name}`);
    }
  }
}
