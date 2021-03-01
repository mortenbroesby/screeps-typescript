
function upgraderAction(creep: Creep): void {
  console.log("Creep name: ", creep.name);

  const roomController = creep.room.controller;
  if (!roomController) {
    return console.log("No room controller!");
  }

  if (creep.store[RESOURCE_ENERGY] == 0) {
    var sources = creep.room.find(FIND_SOURCES);
    if (creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
      creep.moveTo(sources[0], { visualizePathStyle: { stroke: '#ffaa00' } });
    }
  }
  else {
    if (creep.upgradeController(roomController) == ERR_NOT_IN_RANGE) {
      creep.moveTo(roomController, { visualizePathStyle: { stroke: '#ffffff' } });
    }
  }
}

const roleUpgrader = {
  run: (creep: Creep) => upgraderAction(creep),
};

export {
  roleUpgrader
}
