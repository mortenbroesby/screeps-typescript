declare const PRODUCTION: boolean;
declare const LOG_LEVEL: number;

declare const __REVISION__: string;
declare const __BUILD_TIME__: string;

type CreepRole = "unassigned" | "builder" | "harvester" | "upgrader";

interface CreepMemory {
  version: string;
  role: CreepRole;
  state: string;
}

interface MemorySettings {
  version: string;

  minimumCreepsOfType: {
    [key in CreepRole]: number;
  };
}

interface Memory {
  settings: MemorySettings;
}

declare namespace NodeJS {
  interface Global {
    Memory?: Memory;
  }
}
