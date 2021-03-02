declare const PRODUCTION: boolean;
declare const __REVISION__: string;
declare const __BUILD_TIME__: string;

type Role = "Unassigned" | "Builder" | "Harvester" | "Upgrader";

interface CreepMemory {
  version: string;
  role: Role;
  homeRoom: string;
  building?: boolean;
}

interface MemorySettings {
  version: string;

  minimumCreepsInRoom: {
    [key in Role]: number;
  };
}

interface Memory {
  settings: MemorySettings;
}
