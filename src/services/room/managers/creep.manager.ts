import { defaultSettings } from "config/settings";
import { logger } from "tools/logger";
import { executeAction } from "tools/utils";
import { Manager } from "./abstract.manager";

import { BaseRole, BaseRoleMemory } from "roles/abstract.role";
import { UpgraderRole } from "roles/upgrader.role";
import { HarvesterRole } from "roles/harvester.role";
import { BuilderRole } from "roles/builder.role";
import { defaultCreepMemory } from "config/creep";

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
    const creepsInRoom = this.currentRoom.find(FIND_MY_CREEPS);

    this._trySpawningCreeps(creepsInRoom);
    this._tryAssigningRoles(creepsInRoom);
  }

  private _trySpawningCreeps(creeps: Creep[]): void {
    if (this.spawn === undefined) {
      return logger.debug(`[Abort Spawn] No spawn in room: ${this.currentRoom.name}`);
    }

    if (this.spawn.spawning) {
      const spawningCreep = Game.creeps[this.spawn.spawning.name];

      const { role } = spawningCreep.memory;
      const { pos: position } = this.spawn;

      const style: TextStyle = {
        align: "left",
        opacity: 0.8
      };

      this.spawn.room.visual.text(`🛠️${role}`, position.x + 1, position.y, style);

      return logger.debug(`[Abort Spawn] Is already spawning: ${this.spawn.spawning.name}`);
    }

    const minimumCreepsOfType = Memory.settings?.minimumCreepsOfType ?? defaultSettings().minimumCreepsOfType;
    const sortedEntries = Object.entries(minimumCreepsOfType).sort(([, a], [, b]) => a.priority - b.priority);

    sortedEntries.forEach(entry => {
      const [role, creepCountMinimum] = entry;
      const { count } = creepCountMinimum;

      const creepsOfType = _.filter(creeps, creep => creep.memory.role === role);

      // console.log(`${role}: target count: ${count} - priority: ${priority}`);
      // logger.debug(`Creeps with role ${role} - count: ${creepsOfType.length}`);

      if (creepsOfType.length < count) {
        this._trySpawningCreep(role as CreepRole);
      }
    });
  }

  private _trySpawningCreep(role: CreepRole): void {
    if (this.spawn === undefined) {
      return logger.debug(`[No spawn] Skipping spawning: ${this.currentRoom.name}`);
    }

    const creepName = `${role}_${Game.time}`;

    const didSpawnCreep = this.spawn.spawnCreep([WORK, CARRY, MOVE], creepName, {
      memory: defaultCreepMemory(role)
    });

    if (didSpawnCreep === OK) {
      logger.debug(`Spawned new ${role} with name ${creepName}`);
    }
  }

  private _tryAssigningRoles(creeps: Creep[]): void {
    creeps.forEach((creep: Creep) => {
      this._tryAssigningRole(creep);
    });
  }

  private _tryAssigningRole(creep: Creep): void {
    const creepRole: CreepRole = creep.memory.role ?? "unassigned";

    type RoleFunction = () => BaseRole<BaseRoleMemory>;
    type RoleAssignment = RoleFunction | undefined;

    type RoleMap = {
      [key in CreepRole]: RoleAssignment;
    };

    const roleMap: RoleMap = {
      harvester: () => new HarvesterRole(creep, this.currentRoom),
      builder: () => new BuilderRole(creep, this.currentRoom),
      upgrader: () => new UpgraderRole(creep, this.currentRoom),

      // Do nothing for unassigned roles
      unassigned: undefined
    };

    const didExecute = executeAction(roleMap[creepRole]);
    if (!didExecute) {
      logger.debug(`Creep is missing role: ${creep.name}`);
    }
  }
}
