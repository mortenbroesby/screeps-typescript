import { CreepRole } from "./abstract";

type BuilderState = "build" | "harvest" | "idle";

export interface BuilderMemory extends CreepMemory {
  state: BuilderState;
}

export class BuilderRole extends CreepRole {
  public constructor(creep: Creep, homeRoom: Room) {
    super({
      role: "Builder",
      homeRoom,
      creep
    });
  }

  public run(): void {
    this.tryBuilding();
  }

  public get memory(): BuilderMemory {
    return this.creep.memory as BuilderMemory;
  }

  public tryBuilding(): void {
    if (this.memory.state !== "harvest" && this.creep.store[RESOURCE_ENERGY] === 0) {
      this.memory.state = "harvest";
      this.creep.say("🔄 harvest");
    }

    if (this.memory.state !== "build" && this.creep.store.getFreeCapacity() === 0) {
      this.memory.state = "build";
      this.creep.say("🚧 build");
    }

    if (this.memory.state === "build") {
      const targets = this.creep.room.find(FIND_CONSTRUCTION_SITES) ?? [];

      if (targets.length > 0) {
        const sortedTargets = _.sortBy(targets, target => this.creep.pos.getRangeTo(target));

        if (this.creep.build(sortedTargets[0]) === ERR_NOT_IN_RANGE) {
          this.creep.moveTo(sortedTargets[0], { visualizePathStyle: { stroke: "#ffffff" } });
        }
      }
    } else if (this.memory.state === "harvest") {
      if (this.creep.store.getFreeCapacity() > 0) {
        const source = this.creep.pos.findClosestByRange(FIND_SOURCES_ACTIVE);
        if (!source) return;

        const attemptHarvesting = this.creep.harvest(source);
        if (attemptHarvesting === ERR_NOT_IN_RANGE) {
          this.creep.moveTo(source, { visualizePathStyle: { stroke: "#ffaa00" } });
        }
      }
    }
  }
}
