import dayjs from "dayjs";

import { ErrorMapper } from "utils/ErrorMapper";

// When compiling TS to JS and bundling with rollup, the line numbers and file names in error messages change
// This utility uses source maps to get the line numbers and file names of the original, TS source code

// log the latest commit ID from git

let loopStarted: boolean = false;

function startLoop(): void {
  if (loopStarted) return;
  loopStarted = true;

  console.log("----------------------------")
  console.log("Is production? -", PRODUCTION ? "Yes." : "No.")

  const currentDate = dayjs().format('MM.DD.YYYY');
  const currentTime = dayjs().format('HH:mm:ss');

  console.log(`Build date: ${currentDate}`)
  console.log(`Build time: ${currentTime}`)
  console.log("----------------------------")
}

import { roleHarvester } from "./roles/harvester"
import { roleUpgrader } from "./roles/upgrader"
import { roleBuilder } from "./roles/builder"

export const loop = ErrorMapper.wrapLoop(() => {
  startLoop();

  console.log(`Current game tick is ${Game.time}`);

  // Automatically delete memory of missing creeps
  for (const name in Memory.creeps) {
    if (!(name in Game.creeps)) {
      delete Memory.creeps[name];
      console.log('Clearing non-existing creep memory:', name);
    }
  }

  for (var name in Game.rooms) {
    console.log('Room "' + name + '" has ' + Game.rooms[name].energyAvailable + ' energy');
  }

  var harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester');
  console.log('Harvesters: ' + harvesters.length);

  if (harvesters.length < 2) {
    var newName = 'Harvester' + Game.time;
    console.log('Spawning new harvester: ' + newName);

    Game.spawns['Spawn1'].spawnCreep([WORK, CARRY, MOVE], newName, { memory: { role: 'harvester' } });
  }

  if (Game.spawns['Spawn1'].spawning) {
    const spawningCreep = Game.creeps[Game.spawns['Spawn1'].spawning.name];

    Game.spawns['Spawn1'].room.visual.text(
      '🛠️' + spawningCreep.memory.role,
      Game.spawns['Spawn1'].pos.x + 1,
      Game.spawns['Spawn1'].pos.y,
      { align: 'left', opacity: 0.8 });
  }

  for (var name in Game.creeps) {
    const creep = Game.creeps[name];

    if (creep.memory.role == 'harvester') {
      roleHarvester.run(creep);
    }

    if (creep.memory.role == 'builder') {
      roleBuilder.run(creep);
    }

    if (creep.memory.role == 'upgrader') {
      roleUpgrader.run(creep);
    }
  }
});
