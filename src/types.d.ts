declare const PRODUCTION: boolean;
declare const PROFILER_ENABLED: boolean;

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

interface ProfilerData {
  calls: number;
  time: number;
}

declare namespace NodeJS {
  interface Global {
    Memory?: Memory;
    Profiler: import("./profiler").Profiler;
    Brain: import("./global/Brain").Brain;
  }
}
