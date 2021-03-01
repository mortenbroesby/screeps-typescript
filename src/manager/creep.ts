import { logger } from "tools/logger";

import { Manager, ManagerPriority } from "./abstract";

import { HarvesterRole } from "../roles/harvester"
import { BuilderRole } from "../roles/builder"
import { UpgraderRole } from "roles/upgrader";
import { spawn } from "child_process";
import { Role } from "enums";

export class CreepManager extends Manager {
  public constructor() {
    super({
      name: CreepManager.name,
      priority: ManagerPriority.Standard
    });
  }

  /**
   * Game loop.
   */
  public loop(): void {
    const harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == Role.Harvester);

    // logger.info('Harvesters: ' + harvesters.length);

    if (harvesters.length < 2) {
      var newName = 'Harvester' + Game.time;

      let didSpawnCreep = Game.spawns['Spawn1'].spawnCreep([WORK, CARRY, MOVE], newName, { memory: { role: Role.Harvester } });
      if (didSpawnCreep === OK) {
        logger.info('Spawned new harvester: ' + newName);
      }
    }

    if (Game.spawns['Spawn1'].spawning) {
      const spawningCreep = Game.creeps[Game.spawns['Spawn1'].spawning.name];

      Game.spawns['Spawn1'].room.visual.text(
        '🛠️' + spawningCreep.memory.role,
        Game.spawns['Spawn1'].pos.x + 1,
        Game.spawns['Spawn1'].pos.y,
        { align: 'left', opacity: 0.8 });
    }

    for (var name in Game.creeps) {
      const creep = Game.creeps[name];

      if (creep.memory.role == Role.Harvester) {
        new HarvesterRole(creep).run();
      }

      if (creep.memory.role == Role.Builder) {
        new BuilderRole(creep).run();
      }

      if (creep.memory.role == Role.Upgrader) {
        new UpgraderRole(creep).run();
      }
    }
  }
}
