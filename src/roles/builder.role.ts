import { defaultCreepMemory } from "config/creep";
import { Profile } from "profiler";
import { logger } from "tools/logger";
import { executeAction } from "tools/utils";
import { BaseRole, BaseRoleMemory } from "./abstract.role";
import { getTargetStructures } from "./harvester.role";
import { SharedTasks } from "./shared/shared-tasks";

type BuilderState = "build" | "harvest";

export interface BuilderMemory extends BaseRoleMemory {
  state: BuilderState;
}

@Profile
export class BuilderRole extends BaseRole<BuilderMemory> {
  public constructor(creep: Creep, homeRoom: Room) {
    super({
      role: "builder",
      homeRoom,
      creep
    });

    this.memory = {
      ...defaultCreepMemory(),
      homeRoom: homeRoom.name,
      role: "builder",
      state: "harvest"
    };

    this.run();
  }

  public get state(): BuilderState {
    return this.memory.state;
  }
  public set state(state: BuilderState) {
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
    } else if (this.state !== "build" && this.creep.store.getFreeCapacity() === 0) {
      this.state = "build";
      this.creep.say("🚧 build");
    }
  }

  private _getTask(): void {
    type TaskMap = {
      [key in BuilderState]: () => void;
    };

    const taskMap: TaskMap = {
      harvest: () => this._tryHarvesting(),
      build: () => this._tryBuilding()
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

  private _tryBuilding(): void {
    const constructionTargets = this.creep.room.find(FIND_CONSTRUCTION_SITES) ?? [];

    if (constructionTargets.length === 0) {
      const depositTargets = getTargetStructures(this.creep.room);

      const didDeposit = SharedTasks.depositTask(this.creep, depositTargets);
      if (!didDeposit) {
        const didMove = SharedTasks.moveToControllerOrSpawnTask(this.creep, this.homeRoom);
        if (!didMove) {
          logger.debug(`Creep move unsuccessful: ${this.creep.name}`);
        }
      }
    } else {
      const didBuild = SharedTasks.buildTask(this.creep, constructionTargets);
      if (!didBuild) {
        logger.debug(`Creep build unsuccessful: ${this.creep.name}`);
      }
    }
  }
}
