declare const PRODUCTION: boolean;
declare const LOG_LEVEL: number;
declare const PROFILER_ENABLED: boolean;

declare const __REVISION__: string;
declare const __BUILD_TIME__: string;

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
  profiler: ProfilerMemory;
}

interface ProfilerMemory {
  data: { [name: string]: ProfilerData };
  start?: number;
  total: number;
}

interface ProfilerData {
  calls: number;
  time: number;
}

interface Profiler {
  clear(): void;
  output(): void;
  start(): void;
  status(): void;
  stop(): void;
  help(): string;
}

declare namespace NodeJS {
  interface Global {
    Memory?: Memory;
    Profiler?: Profiler;
  }
}
