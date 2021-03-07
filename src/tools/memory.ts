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
    const parsedMemory: Memory = JSON.parse(RawMemory.get());

    const settingsVersion = parsedMemory?.settings?.version ?? "-1";
    if (settingsVersion !== defaultSettings().version) {
      throw new Error("Invalid settings version");
    }

    return parsedMemory;
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
