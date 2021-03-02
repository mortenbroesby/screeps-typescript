import { Role } from "enums";
import { logger } from "tools/logger";
import { CreepRole } from "./abstract";

const targetStructures = (room: Room) => {
  const targets = room.find(FIND_STRUCTURES, {
    filter: structure => {
      type MatchedStructure = StructureExtension | StructureSpawn | StructureTower;

      const structureMatches =
        structure.structureType === STRUCTURE_EXTENSION ||
        structure.structureType === STRUCTURE_SPAWN ||
        structure.structureType === STRUCTURE_TOWER;

      const freeCapacity = (structure as MatchedStructure).store?.getFreeCapacity(RESOURCE_ENERGY) ?? 0;
      const hasCapacity = freeCapacity > 0;

      return structureMatches && hasCapacity;
    }
  });

  return targets;
};

export class HarvesterRole extends CreepRole {
  public constructor(creep: Creep, room: Room) {
    super({
      name: HarvesterRole.name,
      role: Role.Harvester,
      room,
      creep
    });
  }

  public run(): void {
    // logger.debug("HarvesterRole is running.");

    this.tryHarvesting();
  }

  public tryHarvesting(): void {
    // console.log("Creep name: ", this.creep.name);

    if (this.creep.store.getFreeCapacity() > 0) {
      const source = this.creep.pos.findClosestByRange(FIND_SOURCES_ACTIVE);
      if (!source) {
        return logger.debug(`creep ${this.creep.name} has no source`);
      }

      const attemptHarvesting = this.creep.harvest(source);
      if (attemptHarvesting === ERR_NOT_IN_RANGE) {
        this.creep.moveTo(source, { visualizePathStyle: { stroke: "#ffaa00" } });
      }
    } else {
      const targets = targetStructures(this.creep.room);

      if (targets.length > 0) {
        const sortedTargets = _.sortBy(targets, target => this.creep.pos.getRangeTo(target));

        if (this.creep.transfer(sortedTargets[0], RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
          this.creep.moveTo(sortedTargets[0], { visualizePathStyle: { stroke: "#ffffff" } });
        }
      }
    }
  }
}
