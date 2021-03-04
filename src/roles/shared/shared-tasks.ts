export function harvestTask(creep: Creep): boolean {
  if (creep.store.getFreeCapacity() > 0) {
    const source = creep.pos.findClosestByRange(FIND_SOURCES_ACTIVE);
    if (!source) {
      return false;
    }

    const attemptHarvesting = creep.harvest(source);
    if (attemptHarvesting === ERR_NOT_IN_RANGE) {
      creep.moveTo(source, { visualizePathStyle: { stroke: "#ffaa00" } });
    }

    return true;
  }

  return false;
}

export function depositTask(creep: Creep, targets: AnyStructure[]): boolean {
  if (targets.length > 0) {
    const sortedTargets = _.sortBy(targets, target => creep.pos.getRangeTo(target));

    const attemptTransfer = creep.transfer(sortedTargets[0], RESOURCE_ENERGY);
    if (attemptTransfer === ERR_NOT_IN_RANGE) {
      creep.moveTo(sortedTargets[0], { visualizePathStyle: { stroke: "#ffffff" } });
    }

    return true;
  }

  return false;
}

export function buildTask(creep: Creep, targets: ConstructionSite[]): boolean {
  if (targets.length > 0) {
    const sortedTargets = _.sortBy(targets, target => creep.pos.getRangeTo(target));

    const attemptBuild = creep.build(sortedTargets[0]);
    if (attemptBuild === ERR_NOT_IN_RANGE) {
      creep.moveTo(sortedTargets[0], { visualizePathStyle: { stroke: "#ffffff" } });
    }

    return true;
  }

  return false;
}

export function upgradeTask(creep: Creep): boolean {
  const roomController = creep.room.controller;
  if (!roomController) {
    return false;
  }

  const attemptControllerUpgrade = creep.upgradeController(roomController);
  if (attemptControllerUpgrade === ERR_NOT_IN_RANGE) {
    creep.moveTo(roomController, { visualizePathStyle: { stroke: "#ffffff" } });
  }

  return true;
}

export function moveToControllerOrSpawnTask(creep: Creep, room: Room): boolean {
  const roomController = creep.room.controller;
  if (roomController) {
    creep.moveTo(roomController, { visualizePathStyle: { stroke: "#ffffff" } });

    return true;
  }

  const allSpawnsInRoom = room.find(FIND_MY_STRUCTURES, {
    filter: structure => structure.structureType === STRUCTURE_SPAWN
  }) as StructureSpawn[];

  const firstSpawnInRoom = allSpawnsInRoom[0];
  if (firstSpawnInRoom) {
    creep.moveTo(firstSpawnInRoom, { visualizePathStyle: { stroke: "#ffffff" } });

    return true;
  }

  return false;
}
