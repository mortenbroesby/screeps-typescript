import { defaultCreepMemory } from "config/creep";
import { Profile } from "profiler";
import { logger } from "tools/logger";
import { executeAction } from "tools/utils";

import { BaseRole, BaseRoleMemory } from "./abstract.role";
import { SharedTasks } from "./shared/shared-tasks";

type TargetStructure = StructureExtension | StructureSpawn | StructureTower;

export const getTargetStructures = (room: Room): TargetStructure[] => {
  const targets = room.find(FIND_STRUCTURES, {
    filter: structure => {
      const structureMatches =
        structure.structureType === STRUCTURE_EXTENSION ||
        structure.structureType === STRUCTURE_SPAWN ||
        structure.structureType === STRUCTURE_TOWER;

      const freeCapacity = (structure as TargetStructure).store?.getFreeCapacity(RESOURCE_ENERGY) ?? 0;
      const hasCapacity = freeCapacity > 0;

      return structureMatches && hasCapacity;
    }
  }) as TargetStructure[];

  return targets;
};

type HarvesterState = "harvest" | "deposit";

export interface HarvesterMemory extends BaseRoleMemory {
  state: HarvesterState;
}

@Profile
export class HarvesterRole extends BaseRole<HarvesterMemory> {
  public constructor(creep: Creep, homeRoom: Room) {
    super({
      role: "harvester",
      homeRoom,
      creep
    });

    this.memory = {
      ...defaultCreepMemory(),
      homeRoom: homeRoom.name,
      role: "harvester",
      state: "harvest"
    };

    this.run();
  }

  public get state(): HarvesterState {
    return this.memory.state;
  }
  public set state(state: HarvesterState) {
    this.memory.state = state;
  }

  public run(): void {
    this._setState();
    this._getTask();
  }

  private _setState(): void {
    if (this.state !== "harvest" && this.creep.store[RESOURCE_ENERGY] === 0) {
      this.state = "harvest";
      this.creep.say("🔄 harvest");
    } else if (this.state !== "deposit" && this.creep.store.getFreeCapacity() === 0) {
      this.state = "deposit";
      this.creep.say("⚡️ deposit");
    }
  }

  private _getTask(): void {
    type TaskMap = {
      [key in HarvesterState]: () => void;
    };

    const taskMap: TaskMap = {
      harvest: () => this._tryHarvesting(),
      deposit: () => this._tryDepositing()
    };

    const didExecute = executeAction(taskMap[this.state]);
    if (!didExecute) {
      logger.debug(`Creep task mismatch: ${this.creep.name}`);
    }
  }

  private _tryHarvesting(): void {
    const didHarvest = SharedTasks.harvestTask(this.creep);
    if (!didHarvest) {
      logger.debug(`Creep harvest unsuccessful: ${this.creep.name}`);
    }
  }

  private _tryDepositing(): void {
    const targets = getTargetStructures(this.creep.room);

    const didDeposit = SharedTasks.depositTask(this.creep, targets);
    if (!didDeposit) {
      logger.debug(`Creep deposit unsuccessful: ${this.creep.name}`);
    }
  }
}
