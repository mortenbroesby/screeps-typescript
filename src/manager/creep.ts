import { logger } from "tools/logger";

import { roleHarvester } from "../roles/harvester"
import { roleUpgrader } from "../roles/upgrader"
import { roleBuilder } from "../roles/builder"
import { Manager, ManagerPriority } from "./abstract";

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
    const harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester');

    logger.info('Harvesters: ' + harvesters.length);

    if (harvesters.length < 2) {
      var newName = 'Harvester' + Game.time;
      logger.info('Spawning new harvester: ' + newName);

      Game.spawns['Spawn1'].spawnCreep([WORK, CARRY, MOVE], newName, { memory: { role: 'harvester' } });
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

      if (creep.memory.role == 'harvester') {
        roleHarvester.run(creep);
      }

      if (creep.memory.role == 'builder') {
        roleBuilder.run(creep);
      }

      if (creep.memory.role == 'upgrader') {
        roleUpgrader.run(creep);
      }
    }
  }
}
