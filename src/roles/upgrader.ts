import { Role } from "enums";
import { logger } from "tools/logger";
import { CreepRole } from "./abstract";

export class UpgraderRole extends CreepRole {
  public constructor(creep: Creep) {
    super({
      name: UpgraderRole.name,
      role: Role.Upgrader,
      creep
    });
  }

  public run(): void {
    logger.debug("UpgraderRole is running.");

    this.tryUpgrading();
  }

  public tryUpgrading(): void {
    const roomController = this.creep.room.controller;
    if (!roomController) {
      return console.log("No room controller!");
    }

    if (this.creep.store[RESOURCE_ENERGY] == 0) {
      var sources = this.creep.room.find(FIND_SOURCES);
      if (this.creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
        this.creep.moveTo(sources[0], { visualizePathStyle: { stroke: '#ffaa00' } });
      }
    }
    else {
      if (this.creep.upgradeController(roomController) == ERR_NOT_IN_RANGE) {
        this.creep.moveTo(roomController, { visualizePathStyle: { stroke: '#ffffff' } });
      }
    }
  }
}
