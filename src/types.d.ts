/**
 * Global build parameters
 */
declare const NODE_ENV: string;
declare const BUILD_DATE: string;
declare const IS_PRODUCTION: boolean;
declare const IS_DEBUG: boolean;
declare const IS_PROFILER_ENABLED: boolean;

/**
 * Global Screeps types
 */
type CreepRole = "unassigned" | "builder" | "harvester" | "upgrader";

interface CreepMemory {
  version: string;
  role: CreepRole;
  state: string;
}

interface MinimumCreepCount {
  count: number;
  priority: number;
}

type MinimumCreepCountMap = {
  [key in CreepRole]: MinimumCreepCount;
};

interface MemorySettings {
  version: string;

  minimumCreepsOfType: MinimumCreepCountMap;
}

interface Memory {
  settings: MemorySettings;
}

/**
 * Global Node types
 */
declare namespace NodeJS {
  interface Global {
    Memory?: Memory;
    Brain: import("./global/Brain").Brain;
  }
}
