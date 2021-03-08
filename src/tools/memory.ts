import { defaultSettings } from "../config/settings";

const defaultMemory: () => Memory = () => ({
  powerCreeps: {},
  flags: {},
  rooms: {},
  spawns: {},
  creeps: {},

  settings: defaultSettings()
});

function getMemory(): Memory {
  try {
    return JSON.parse(RawMemory.get());
  } catch (error) {
    return defaultMemory();
  }
}

export const setupMemory: () => void = () => {
  delete global.Memory;
  global.Memory = getMemory();
};

export const setupInitialMemory: () => void = () => {
  setupMemory();
};

export const shutdownMemory: () => void = () => {
  RawMemory.set(JSON.stringify(Memory));
};
