import { Role } from "enums";
import { CreepRole } from "./abstract";

export class BuilderRole extends CreepRole {
  public constructor(creep: Creep, room: Room) {
    super({
      name: BuilderRole.name,
      role: Role.Builder,
      room,
      creep
    });
  }

  public run(): void {
    // logger.debug("BuilderRole is running.");

    this.tryBuilding();
  }

  public tryBuilding(): void {
    if (this.creep.memory.building && this.creep.store[RESOURCE_ENERGY] === 0) {
      this.creep.memory.building = false;
      this.creep.say("🔄 harvest");
    }

    if (!this.creep.memory.building && this.creep.store.getFreeCapacity() === 0) {
      this.creep.memory.building = true;
      this.creep.say("🚧 build");
    }

    if (this.creep.memory.building) {
      const targets = this.creep.room.find(FIND_CONSTRUCTION_SITES) ?? [];

      if (targets.length > 0) {
        const sortedTargets = _.sortBy(targets, target => this.creep.pos.getRangeTo(target));

        if (this.creep.build(sortedTargets[0]) === ERR_NOT_IN_RANGE) {
          this.creep.moveTo(sortedTargets[0], { visualizePathStyle: { stroke: "#ffffff" } });
        }
      }
    } else if (this.creep.store.getFreeCapacity() > 0) {
      const source = this.creep.pos.findClosestByRange(FIND_SOURCES_ACTIVE);
      if (!source) return;

      const attemptHarvesting = this.creep.harvest(source);
      if (attemptHarvesting === ERR_NOT_IN_RANGE) {
        this.creep.moveTo(source, { visualizePathStyle: { stroke: "#ffaa00" } });
      }
    }
  }
}
