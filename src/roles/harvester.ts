import { Role } from "enums";
import { CreepRole } from "./abstract";

export class HarvesterRole extends CreepRole {
  public constructor(creep: Creep) {
    super({
      name: HarvesterRole.name,
      role: Role.Harvester,
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
      const sources = this.creep.room.find(FIND_SOURCES);
      if (this.creep.harvest(sources[0]) === ERR_NOT_IN_RANGE) {
        this.creep.moveTo(sources[0], { visualizePathStyle: { stroke: "#ffaa00" } });
      }
    } else {
      const targets = this.creep.room.find(FIND_STRUCTURES, {
        filter: structure => {
          return (
            (structure.structureType === STRUCTURE_EXTENSION ||
              structure.structureType === STRUCTURE_SPAWN ||
              structure.structureType === STRUCTURE_TOWER) &&
            structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0
          );
        }
      });

      if (targets.length > 0) {
        if (this.creep.transfer(targets[0], RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
          this.creep.moveTo(targets[0], { visualizePathStyle: { stroke: "#ffffff" } });
        }
      }
    }
  }
}
