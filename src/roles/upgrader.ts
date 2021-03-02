import { logger } from "tools/logger";
import { CreepRole } from "./abstract";

export class UpgraderRole extends CreepRole {
  public constructor(creep: Creep, homeRoom: Room) {
    super({
      role: "Upgrader",
      homeRoom,
      creep
    });
  }

  public run(): void {
    // logger.debug("UpgraderRole is running.");

    this.tryUpgrading();
  }

  public tryUpgrading(): void {
    const roomController = this.creep.room.controller;
    if (!roomController) {
      return logger.error(`No room controller for creep: ${this.creep.name}!`);
    }

    const storedEnergy = this.creep.store[RESOURCE_ENERGY];

    if (storedEnergy === 0) {
      const source = this.creep.pos.findClosestByRange(FIND_SOURCES_ACTIVE);
      if (!source) {
        return logger.debug(`creep ${this.creep.name} has no source`);
      }

      const attemptHarvesting = this.creep.harvest(source);
      if (attemptHarvesting === ERR_NOT_IN_RANGE) {
        this.creep.moveTo(source, { visualizePathStyle: { stroke: "#ffaa00" } });
      }
    } else {
      const attemptControllerUpgrade = this.creep.upgradeController(roomController);

      if (attemptControllerUpgrade === ERR_NOT_IN_RANGE) {
        this.creep.moveTo(roomController, { visualizePathStyle: { stroke: "#ffffff" } });
      }
    }
  }
}
