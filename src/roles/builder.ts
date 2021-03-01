import { Role } from "enums";
import { logger } from "tools/logger";
import { CreepRole } from "./abstract";

export class BuilderRole extends CreepRole {
  public constructor(creep: Creep) {
    super({
      name: BuilderRole.name,
      role: Role.Builder,
      creep
    });
  }

  public run(): void {
    logger.debug("BuilderRole is running.");

    this.tryBuilding();
  }

  public tryBuilding(): void {
    if (this.creep.memory.building && this.creep.store[RESOURCE_ENERGY] == 0) {
      this.creep.memory.building = false;
      this.creep.say('🔄 harvest');
    }

    if (!this.creep.memory.building && this.creep.store.getFreeCapacity() == 0) {
      this.creep.memory.building = true;
      this.creep.say('🚧 build');
    }

    if (this.creep.memory.building) {
      var targets = this.creep.room.find(FIND_CONSTRUCTION_SITES);
      if (targets.length) {
        if (this.creep.build(targets[0]) == ERR_NOT_IN_RANGE) {
          this.creep.moveTo(targets[0], { visualizePathStyle: { stroke: '#ffffff' } });
        }
      }
    }
    else {
      var sources = this.creep.room.find(FIND_SOURCES);
      if (this.creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
        this.creep.moveTo(sources[0], { visualizePathStyle: { stroke: '#ffaa00' } });
      }
    }
  }
}
