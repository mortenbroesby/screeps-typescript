import { Role } from "enums";
import { CreepRole } from "roles/abstract";
import { UpgraderRole } from "roles/upgrader";
import { logger } from "tools/logger";

import { BuilderRole } from "../../roles/builder";
import { HarvesterRole } from "../../roles/harvester";
import { Manager } from "./abstract";

interface CreepCollection {
  [role: number]: Creep[];
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

      if (creep.memory.role === undefined) {
        console.log(`Creep with unknown role: ${creep.name} Pos: ${creep.pos.roomName}`);
        console.log("Removing creep from game...");

        creep.suicide();
        continue;
      }

      if (collection[creep.memory.role] === undefined) {
        collection[creep.memory.role] = [];
      }

      collection[creep.memory.role].push(creep);
    }

    return collection;
  }

  /**
   * Game loop.
   */
  public loop(): void {
    if (this.spawn === undefined) {
      return logger.info(`[No spawn] Skipping spawning: ${this.currentRoom.name}`);
    }

    if (this.spawn.spawning) {
      const spawningCreep = Game.creeps[this.spawn.spawning.name];

      this.spawn.room.visual.text(`🛠️${spawningCreep.memory.role}`, this.spawn.pos.x + 1, this.spawn.pos.y, {
        align: "left",
        opacity: 0.8
      });

      return logger.info(`[Spawning] Skipping spawning: ${this.currentRoom.name}`);
    }

    const creepsInRoom = this.currentRoom.find(FIND_MY_CREEPS);

    const harvesters = _.filter(creepsInRoom, creep => creep.memory.role === Role.Harvester);

    logger.info(`Harvesters: ${harvesters.length}`);

    if (harvesters.length < 2) {
      const newName = `Harvester${Game.time}`;

      const didSpawnCreep = this.spawn.spawnCreep([WORK, CARRY, MOVE], newName, {
        memory: {
          role: Role.Harvester,
          homeRoom: this.spawn.name
        }
      });

      if (didSpawnCreep === OK) {
        logger.info("Spawned new harvester: " + newName);
      }
    }

    creepsInRoom.forEach((creep: Creep) => {
      const creepRole: Role = creep.memory.role ?? Role.Unassigned;

      type RoleFunction = () => CreepRole;
      type RoleAssignment = RoleFunction | undefined;

      type RoleMap = {
        [key in Role]: RoleAssignment;
      };

      const roleMap: RoleMap = {
        [Role.Harvester]: () => new HarvesterRole(creep, this.currentRoom),
        [Role.Builder]: () => new BuilderRole(creep, this.currentRoom),
        [Role.Upgrader]: () => new UpgraderRole(creep, this.currentRoom),

        [Role.Unassigned]: undefined
      };

      const targetAssignment = roleMap[creepRole];
      const assignmentExists = targetAssignment !== undefined;

      if (targetAssignment && assignmentExists) {
        targetAssignment().run();
      } else {
        logger.info(`Creep is missing role: ${creep.name}`);
      }
    });
  }
}
