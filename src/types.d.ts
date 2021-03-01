// example declaration file - remove these and add your own custom typings

// memory extension samples
interface CreepMemory {
  role: number;
  room?: string;
  working?: boolean;
  building?: boolean;
}

interface MemorySettings {
  version: string;
}

interface Memory {
  settings: MemorySettings;
}

// `global` extension samples
declare namespace NodeJS {
  interface Global {
    log: any;
  }
}

declare const PRODUCTION: boolean;
declare const __REVISION__: string;
declare const __BUILD_TIME__: string;
