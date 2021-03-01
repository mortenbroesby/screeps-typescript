// example declaration file - remove these and add your own custom typings

// memory extension samples
interface CreepMemory {
  role: string;
  room?: string;
  working?: boolean;
  building?: boolean;
}

interface Memory {
  uuid: number;
  log: any;
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
