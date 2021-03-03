import { defaultCreepMemory } from "config/creep";
import { logger } from "tools/logger";
import { executeAction } from "tools/utils";

import { BaseRole, BaseRoleMemory } from "./abstract";
import { harvestTask, upgradeTask } from "./shared";

type UpgraderState = "harvest" | "upgrade";

export interface UpgraderMemory extends BaseRoleMemory {
  state: UpgraderState;
}

export class UpgraderRole extends BaseRole<UpgraderMemory> {
  public constructor(creep: Creep, homeRoom: Room) {
    super({
      role: "upgrader",
      homeRoom,
      creep
    });

    this.memory = {
      ...defaultCreepMemory,
      homeRoom: homeRoom.name,
      role: "upgrader",
      state: "harvest"
    };

    this.run();
  }

  public get state(): UpgraderState {
    return this.memory.state;
  }
  public set state(state: UpgraderState) {
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
    } else if (this.state !== "upgrade" && this.creep.store.getFreeCapacity() === 0) {
      this.state = "upgrade";
      this.creep.say("⚡️ upgrade");
    }
  }

  private _getTask(): void {
    type TaskMap = {
      [key in UpgraderState]: () => void;
    };

    const taskMap: TaskMap = {
      harvest: () => this._tryHarvesting(),
      upgrade: () => this._tryUpgrading()
    };

    const didExecute = executeAction(taskMap[this.state]);
    if (!didExecute) {
      logger.debug(`Creep task mismatch: ${this.creep.name}`);
    }
  }

  private _tryHarvesting(): void {
    const didHarvest = harvestTask(this.creep);
    if (!didHarvest) {
      logger.debug(`Creep harvest unsuccessful: ${this.creep.name}`);
    }
  }

  private _tryUpgrading(): void {
    const didUpgrade = upgradeTask(this.creep);
    if (!didUpgrade) {
      logger.debug(`Creep harvest unsuccessful: ${this.creep.name}`);
    }
  }
}
