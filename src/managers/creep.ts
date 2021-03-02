import { Role } from "enums";
import { UpgraderRole } from "roles/upgrader";
import { logger } from "tools/logger";

import { BuilderRole } from "../roles/builder";
import { HarvesterRole } from "../roles/harvester";
import { Manager } from "./abstract";

interface CreepCollection {
  [role: number]: Creep[];
}

export class CreepManager extends Manager {
  private _creepCollection: CreepCollection = {};

  public constructor() {
    super({
      name: CreepManager.name
    });

    this._creepCollection = this._createCollection();

    // console.log(JSON.stringify(this.creepCollection))
  }

  public collection(): CreepCollection {
    return this._creepCollection;
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
    const harvesters = _.filter(Game.creeps, creep => creep.memory.role === Role.Harvester);

    // logger.info('Harvesters: ' + harvesters.length);

    if (harvesters.length < 2) {
      const newName = `Harvester${Game.time}`;

      const didSpawnCreep = Game.spawns.Spawn1.spawnCreep([WORK, CARRY, MOVE], newName, {
        memory: { role: Role.Harvester }
      });
      if (didSpawnCreep === OK) {
        logger.info("Spawned new harvester: " + newName);
      }
    }

    if (Game.spawns.Spawn1.spawning) {
      const spawningCreep = Game.creeps[Game.spawns.Spawn1.spawning.name];

      Game.spawns.Spawn1.room.visual.text(
        `🛠️${spawningCreep.memory.role}`,
        Game.spawns.Spawn1.pos.x + 1,
        Game.spawns.Spawn1.pos.y,
        { align: "left", opacity: 0.8 }
      );
    }

    for (const name in Game.creeps) {
      const creep = Game.creeps[name];

      if (creep.memory.role === Role.Harvester) {
        new HarvesterRole(creep).run();
      }

      if (creep.memory.role === Role.Builder) {
        new BuilderRole(creep).run();
      }

      if (creep.memory.role === Role.Upgrader) {
        new UpgraderRole(creep).run();
      }
    }
  }
}
